import {ThunkDispatch} from 'redux-thunk';
import {AnyAction} from 'redux';
import {useDispatch} from 'react-redux';
import {AppRootStateType} from '../state/store';

type UseAppDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>

export const useAppDispatch = () => useDispatch<UseAppDispatchType>();