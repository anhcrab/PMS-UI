export const githubLogin = (e) => {
  e.preventDefault();
  console.log(import.meta.env.VITE_GITHUB_CLIENT_ID);
  location.assign("https://github.com/login/oauth/authorize?client_id=" + import.meta.env.VITE_GITHUB_CLIENT_ID);
}