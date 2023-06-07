export const generateStateValue = () => {
    const length = 32; // Length of the state value
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let stateValue = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      stateValue += characters.charAt(randomIndex);
    }
  
    return stateValue;
}

