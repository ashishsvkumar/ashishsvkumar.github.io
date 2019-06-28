import { action } from "typesafe-actions";
import * as log from "loglevel";
import { UserInfoActionTypes, UserInfo } from "./types";
import { getUserId, getSessionId } from "../../utils/session";
import { memberDetails } from "../../api/mtop";
import { errorCode } from "../../utils/mtop-utils";

const userInfoRequest = () => action(UserInfoActionTypes.FETCH_REQUEST);
const userInfoSuccess = (data: UserInfo) => action(UserInfoActionTypes.FETCH_SUCCESS, data);
const userInfoFailure = (error: string) => action(UserInfoActionTypes.FETCH_FAILURE, error);


export function fetchUserInfo() {

    const userId = getUserId();
    const sessionId = getSessionId()

    return function (dispatch: (param: any) => any): Promise<UserInfo | string> {

        log.info(`Fetching info for user-${userId}`);
        dispatch(userInfoRequest());

        return memberDetails(userId, sessionId)
            .then((response) => {
                if (response.retType === 0) {
                    log.info('Fetched user info')
                    const data: UserInfo = response.data;
                    dispatch(userInfoSuccess(data))
                    return data;
                } else {
                    const err = errorCode(response)
                    log.error(`Error while fetching info for user-${userId}`, err);
                    dispatch(userInfoFailure(err))
                    return err
                }
            })
            .catch((err) => {
                err = errorCode(err)
                log.error(`Unexpected error while fetching info for user-${userId}`, err)
                dispatch(userInfoFailure(err))
                return err
            });
    }
}
