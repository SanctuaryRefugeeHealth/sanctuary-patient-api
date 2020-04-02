async function authenticate() {
  const baseUrl = process.env.SANCTUARY_API_BASE_URL || "localhost";
  const path = process.env.SANCTUARY_API_AUTH_PATH || "/api/auth/";
  const email = process.env.SANCTUARY_EMAIL || "one@test.com";
  const password = process.env.SANCTUARY_PASSWORD || "sanctuary";

  const data = JSON.stringify({
    email,
    password
  })
  const options = {
    hostname: baseUrl,
    port: 80,
    path,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length
    }
  };
  
  return new Promise((resolve, reject) => {
    const lib = baseUrl.startsWith("https") ? require("https") : require("http");
    const req = lib.request(options, (res) => {
      let rawData = "";

      res.on("data", (chunk) => { rawData += chunk; });

      res.on("end", () => resolve(JSON.parse(rawData)));
    })
    
    req.on("error", (error) => reject(error))

    req.write(data);
    req.end();
  });
}

async function triggerSendMessages (authToken) {
  const baseUrl = process.env.SANCTUARY_API_BASE_URL || "localhost";
  const path = process.env.SANCTUARY_API_SEND_MESSAGE_PATH || "/api/user/me";
  
  const options = {
    hostname: baseUrl,
    path,
    headers: {
        Authorization: `Bearer ${authToken}`
    }
}

  return new Promise((resolve, reject) => {
    const lib = baseUrl.startsWith("https") ? require("https") : require("http");
    const request = lib.get(options, (res) => {
      if (res.statusCode < 200 || res.statusCode > 299) {
        return reject(`SendMessage API Call Failed with Code: ${res.statusCode}`);
      }
      // Not interested in the response.
      res.destroy();
      return resolve()
    });
    request.on("error", (err) => reject(err))
  })
}

exports.handler = async () => {
  let auth = null;

  try {
    auth = await authenticate();
  } catch (error) {
    console.log(`Attempt to authenticate failed: ${error}`)
    return Promise.reject(Error(error));
  }

  if(!auth || !auth.token) {
    console.log(`Authentication not successful: ${JSON.stringify(auth)}`);
    return Promise.reject(Error(auth));
  }

  try {
    await triggerSendMessages(auth.token);
  } catch (error) {
    console.log(`Attempt to trigger API failed: ${error}`)
    return Promise.reject(Error(error));
  }

  return Promise.resolve("Success");
};
