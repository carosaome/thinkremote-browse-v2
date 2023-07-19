
import { SupabaseClient, User, createClient } from "@supabase/supabase-js";
import { SignalingConfig } from "../core/src/signaling/config";

export type SbFunction = 'worker_session_create' | 'worker_session_deactivate' | 'worker_profile_fetch' | 'session_authenticate'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnoykey = import.meta.env.VITE_SUPABASE_ANON_KEY
console.log(supabaseUrl);
export const createBrowserClient = () => createClient(supabaseUrl, supabaseAnoykey)

export type AuthSessionResp = {
	id: string
	email: string
	webrtc: RTCConfiguration
	signaling: {
		audioURL: string
		videoURL: string
		dataURL: string
	}
}
export default class SbCore {
	private supabase: SupabaseClient;
	constructor() {
		this.supabase = createBrowserClient()
	}

	public async LoginWithGoogle() {
		await this.supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				//redirectTo:'https://remote.thinkmay.net',
				redirectTo: 'https://carosaome.netlify.app',
				queryParams: {
					access_type: "offline",
					prompt: "consent",
				},
			},
		});
	}

	public async Logout(): Promise<void> {
		await this.supabase.auth.signOut();
	}

	public async Authenticated(): Promise<boolean> {
		return (await this.supabase.auth.getSession()).data.session != null
	}

	public async getUserInfor(): Promise<User | Error> {
		const resp = await this.supabase.auth.getUser();
		return resp.error == null ? resp.data.user : resp.error;
	}


	public async AuthenticateSession(ref: string, uref?: string): Promise<{
		Email: string
		SignalingConfig: SignalingConfig
		WebRTCConfig: RTCConfiguration
		PingCallback: () => Promise<void>
	} | Error> {
		const session = await this.supabase.auth.getSession()
		if (session.error != null && uref == undefined)
			return new Error(session.error.message)

		const headers = uref == undefined ?
			{
				"access_token": session.data?.session?.access_token ?? '',
				"uref": ''
			} :
			{
				"uref": uref,
				"access_token": ''
			}

		const body = JSON.stringify({ reference: ref })
		const { data, error } = await this.supabase.functions.invoke<AuthSessionResp>("session_authenticate" as SbFunction, {
			headers: headers,
			body: body,
			method: 'POST',
		})

		if (error != null || data == null)
			return new Error(error)

		const pingFunc = async () => {
			const { error } = await this.supabase.rpc(`ping_session`, {
				session_id: data.id
			})

			if (error != null) {
				throw `unable to ping ${error.message}`
			}
		}

		return {
			Email: data.email,
			SignalingConfig: data.signaling,
			WebRTCConfig: data.webrtc,
			PingCallback: pingFunc,
		}
	}
}


