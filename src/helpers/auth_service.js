import decode from 'jwt-decode';
import Cookies from 'js-cookie';

const TOKEN = 'Token';

export default class AuthService {

    static isLogged() {
        const token = AuthService.getToken();
        return !!token && !AuthService.isTokenExpired(token);
    }

    static isTokenExpired(token) {
        try {
            const decoded = decode(token);
            return decoded.exp < Date.now() / 1000;
        }
        catch (err) {
            return false;
        }
    }

    static getDecodedToken() {
        return decode(AuthService.getToken());
    }

    static getToken() {
        return Cookies.get(TOKEN);
    }

    static logout() {
        Cookies.remove(TOKEN)
    }
}
