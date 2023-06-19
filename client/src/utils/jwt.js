// Local storage

export const getJWT = () => {
    return localStorage.getItem('qb-starter');
}

export const saveJWT = (jwt) => {
    localStorage.setItem('qb-starter', jwt);
}