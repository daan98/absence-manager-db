import { User as UserModel } from "../entities/user.entity";
export default interface LoginResponseInterface {
    user  : UserModel;
    token : string;
}