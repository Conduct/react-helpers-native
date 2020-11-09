export default function useBatchObjectState<T_StateObject extends Record<any, any>>(initialValue: T_StateObject): readonly [T_StateObject, (newPartialState: Partial<T_StateObject>) => void];
