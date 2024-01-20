export default interface JwtPayload {
    id   : string;
    iat ?: number;
    exp ?: number;
}