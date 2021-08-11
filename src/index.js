const server = require('./server');
const axios = require('axios');
const qs = require('qs');
const secrets = require('../config/secrets.json');

const port = process.env.PORT || 3001;

server.listen(port, () => console.log('API Server listening on port', port));

// --| Get the default endpoint, show a message and send a status code of 200
server.get('/', (req, res) => res.status(200).send({ status: 200, message: "💰 API works just fine!" }));

// --| Get the userid transactions
server.get('/users/:userId/transactions', async (req, res) =>
{
  const id = req.params.userId;

  if (!id) return res.status(403).send({ message: "Unsuccesful Response - Forbidden - Invalid scopes" });

  // --| Wait for the token from bank
  const accessToken = await getAccessTokenFromBank();

  // --| If token is not valid return a 401
  if(!accessToken) return res.status(401).send({ message: "Unsuccesful Response - Not authorised - Missing authorization header - Invalid access Token" });

  return res.status(200).send({ data: await getUserTransactions(id, accessToken) });
});

// --| Function to get a token from the bank
// --| Returns the `access_token` or null otherwise
const getAccessTokenFromBank = async () =>
{
  try
  {
    const data = { scope: "transactions", grant_type: "client_credentials", client_id: secrets.client_id, client_secret: secrets.client_secret };
    const headersOptions = { headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": `Basic ${secrets.authorization_code}` } };

    return await axios.post("https://obmockaspsp.moneyhub.co.uk/api/token", qs.stringify(data), headersOptions).then((response) => response?.data?.access_token?.trim() || null);
  }

  catch (error)
  {
    console.log(error.message);
    return null;
  }
};

// --| Function to get the user transactions according to Swagger
const getUserTransactions = async (userid, token) =>
{
  try
  {
    if (!userid || !token) return null;

    const headersOptions = { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token.trim()}` } };

    // --| Get the transactions
    const result = await axios.get(`https://obmockaspsp.moneyhub.co.uk/api/users/${userid.trim()}/transactions`, headersOptions).then((response) => response?.data?.Data || []);
    const returnData = [];

    for (let i = 0; i < result?.Transactions?.length; i++)
    {
      returnData.push({
        id: result?.Transactions?.[i]?.TransactionId || null,
        accountId: result?.Transactions?.[i]?.AccountId || null,
        amount: result?.Transactions?.[i]?.Amount?.Amount || null,
        date: result?.Transactions?.[i]?.BookingDateTime || null,
        description: result?.Transactions?.[i]?.TransactionInformation?.trim() || null,
        status: result?.Transactions?.[i]?.Status || null
      });
    }

    return returnData;
  }

  catch (error)
  {
    console.log(error.message);
    return null;
  }
};

module.exports = server;