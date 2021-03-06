const initConfiguration = async () => {
  const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
  const response = await fetch(`${publicUrl.origin}/configuration.json`);
  const configuration = await response.json();
  window.localStorage.setItem(
    'AUTHENTICATION_MODE',
    configuration.AUTHENTICATION_MODE,
  );
  window.localStorage.setItem('PEARL_JAM_URL', configuration.PEARL_JAM_URL);
  window.localStorage.setItem('QUEEN_URL_BACK_END', configuration.QUEEN_URL_BACK_END);
  window.localStorage.setItem('QUEEN_URL_FRONT_END', configuration.QUEEN_URL_FRONT_END);
};

export default initConfiguration;
