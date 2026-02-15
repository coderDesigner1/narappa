const AuthService = {
  setToken: (token) => {
    sessionStorage.setItem('authToken', token);
    console.log('Token stored:', token);
  },
  
  getToken: () => {
    return sessionStorage.getItem('authToken');
  },
  
  removeToken: () => {
    sessionStorage.removeItem('authToken');
  },
  
  getAuthHeaders: () => {
    const token = AuthService.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
};

export default AuthService;