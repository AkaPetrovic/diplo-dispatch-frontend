import { JwtPayload } from "jwt-decode";

export default interface CustomJwtPayload extends JwtPayload {
  role?: string;
}
