import {ThunkDispatch} from 'redux-thunk';
import {AnyAction} from 'redux';
import {useDispatch} from 'react-redux';
import {AppRootStateType} from '../state/store';

type AppDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>

export const AppDispatch = () => useDispatch<AppDispatchType>();