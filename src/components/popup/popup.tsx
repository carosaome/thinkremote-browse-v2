import Swal from "sweetalert2";
import { Soundcard, Monitor, } from "../../core/src/models/devices.model";

let have_swal : 'confirm' | 'popup' | 'none' = "none";

export async function TurnOnAlert(error: string): Promise<void> {
    if (have_swal == 'popup') {
        TurnOffStatus();
        have_swal = 'none'
    } 

    if (have_swal == 'confirm') {
        return
    }


    have_swal = 'popup';
    Swal.fire({
        title: "Opps...",
        text: error,
        icon: "error",
        confirmButtonText: "OK",
        timer: 3000,
    });
}

export async function TurnOnConfirm(status: string, text?: string): Promise<void> {
    //while (have_swal == 'confirm') {
	//	await new Promise(r => setTimeout(r, 300));
    //}

    if (have_swal == 'popup') {
        TurnOffStatus();
        have_swal = 'none'
    }

    console.log('turn on confirm');
    have_swal = 'confirm'
    await Swal.fire({
        title: `${status}`,
        text: text ?? "Please click on screen to start",
        confirmButtonText: "START",
        showConfirmButton: true,
    });
    have_swal = 'none'
}
export function TurnOnStatus(status: string, text?: string): void {
    if (have_swal == 'popup') {
        TurnOffStatus();
    } 

    if (have_swal == 'confirm') {
        return
    }

    have_swal = 'popup';
    Swal.fire({
        title: `${status}`,
        text: text ?? "Please wait while the client is getting ready...",
        showConfirmButton: false,
        timer: 2000,
        willOpen: () => Swal.showLoading(),
        willClose: () => Swal.hideLoading(),
    });
}

export function TurnOffStatus(): void {
    Swal.close();
}


export async function TurnOnClipboard(): Promise<string | null> {
    const { value: text } = await Swal.fire({
        input: 'textarea',
        inputLabel: 'Message',
        inputPlaceholder: 'Type your message here...',
        inputAttributes: {
            'aria-label': 'Type your message here'
        },
        showCancelButton: false
    })
    Swal.close();

    if (text) {
        return text
    } else {
        return null
    }
}

export async function AskSelectSoundcard(
    soundcards: Array<Soundcard>
): Promise<string> {
    TurnOffStatus();

    let swalInput: {
        [key: string]: string | {};
      } = {};    soundcards.forEach((x) => {
        if (swalInput[x.Api] == null) {
            swalInput[x.Api] = {};
        }
        //@ts-ignore
        swalInput[x.Api][x.DeviceID] = x.Name;
    });

    const { value: DeviceID } = await Swal.fire({
        title: "Select a soundcard device",
        input: "select",
        inputOptions: swalInput,
        inputPlaceholder: "Click here",
        showCancelButton: false,
        inputValidator: (value) => {
            let result = 'close'

            for (var x of soundcards) {
                if (x.Name == value) {
                    result = "";
                    break
                }
            }
            return result
        },
    });

    return DeviceID;
}

export async function AskSelectDisplay(
    monitors: Array<Monitor>
): Promise<string> {
    TurnOffStatus();
    let swalInput = {};

    monitors.forEach((x) => {
        if (swalInput[x.Adapter] == null) {
            swalInput[x.Adapter] = {};
        }

        swalInput[x.Adapter][x.MonitorHandle] = x.MonitorName;
    });

    const { value: MonitorHandle } = await Swal.fire({
        title: "Select monitor",
        input: "select",
        inputOptions: swalInput,
        inputPlaceholder: "Select monitor",
        showCancelButton: false,
        inputValidator: (value) => {
            let result= 'close'
            for (var x of monitors) {
                if (x.MonitorName == value) {
                    result = "";
                    break
                }
            }
            return result
        },
    });

    return MonitorHandle;
}

export async function AskSelectFramerate(): Promise<number> {
    TurnOffStatus();
    const { value: framerate } = await Swal.fire({
        title: "Select framerate",
        input: "select",
        inputOptions: {
            "30": "30fps",
            "40": "40fps",
            "50": "50fps",
            "55": "55fps",
            "60": "60fps",
            "90": "90fps",
            "120": "120fps",
        },
        inputPlaceholder: "Select framerate",
        showCancelButton: false,
        inputValidator: (value) => {
            return "";
        },
    });

    return Number.parseInt(framerate);
}

export async function AskSelectBitrate(): Promise<number> {
    TurnOffStatus();
    const { value: bitrate } = await Swal.fire({
        title: "Select bitrate",
        input: "select",
        inputOptions: {
            "500": "500 kbps",
            "1000": "1 mbps",
            "2000": "2 mbps",
            "3000": "3 mbps",
            "6000": "6 mbps",
            "8000": "8 mbps",
            "10000": "10 mbps",
            // "20000": "20 mbps",
            // "30000": "30 mbps",
            // "40000": "40 mbps",
            // "60000": "60 mbps",
            // "80000": "80 mbps",
        },
        inputPlaceholder: "Select bitrate",
        showCancelButton: false,
        inputValidator: (value) => {
            return "";
        },
    });

    return Number.parseInt(bitrate);
}
