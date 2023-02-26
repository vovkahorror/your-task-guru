import {ThunkDispatch} from 'redux-thunk';
import {AnyAction} from 'redux';
import {useDispatch} from 'react-redux';
import {AppRootStateType} from '../../app/store';

export type AppDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>

export const useAppDispatch = () => useDispatch<AppDispatchType>();