

export const getJWT = (jwt) => {
    return localStorage.getItem('squarebooks');
}

export const saveJWT = (jwt) => {
    localStorage.setItem('squarebooks', jwt);
    console.log('STORAGE', getJWT())
}