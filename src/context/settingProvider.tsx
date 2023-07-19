import React, { useContext } from 'react';
import Warehouse from '../warehouse';

interface IContext {
	settingValue: ISettingState
	dispatch: React.Dispatch<IAction>
}

interface ISettingState {
	gamePad: IGamePadValue
	virtMouse: any
}
interface IGamePadValue {
	leftScale: number
	rightScale: number
	leftJt: number
	rightJt: number
	dpad: number
	ybxa: number
	rbRt: number
	lbLt: number
	subBtn: number

}

const initialSetting: ISettingState = {
	gamePad: {
		leftScale: 1,
		rightScale: 1,
		leftJt: 1,
		rightJt: 1,
		dpad: 1,
		ybxa: 1,
		rbRt: 1,
		lbLt: 1,
		subBtn: 1,
	},
	virtMouse: {}
};

interface IActionData {
	name: keyof IGamePadValue;
	value: number;
	type: 'gamePad' | 'virtMouse';
}
interface IAction {
	type: string
	data: IActionData
}
const Context = React.createContext<IContext>({ settingValue: initialSetting, dispatch: () => { } })

const reducer = (state: ISettingState, action: IAction): ISettingState => {
	const { data } = action
	switch (action.type) {
		case "UPDATE": {
			const newData = { ...state }
			const { name, value, type } = data
			newData[type][name] = value
			return newData
		}

		default:
			return state;
	}
};


let initialData: ISettingState
// Perform localStorage action
const storedData = localStorage.getItem('settingData');
initialData = storedData ? JSON.parse(storedData) : initialSetting;


function SettingProvider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = React.useReducer(reducer, initialData)
	const saveDataLocal = React.useCallback(() => {
		localStorage.setItem('settingData', JSON.stringify(state))
		const warehouse = new Warehouse()
		warehouse.UpdateUserSetting(state)
	}, [state])



	React.useEffect(() => {
		saveDataLocal()
	}, [saveDataLocal])
	return (
		<Context.Provider value={{ settingValue: state, dispatch }}>
			{children}
		</Context.Provider>
	);
}

export const useSetting = () => useContext(Context)
export default SettingProvider;