This is a simple web app using NEXTjs, NEXT-auth, mongoDB and Material UI.

## Getting Started
First create a ```.env.local```
and setup the server like this:
```
GITHUB_ID=[your own id]
GITHUB_SECRET=[your own id]
MONGODB_URI=[your own mongoDB URI]
JWT_SECRET=[your own secret or " type openssl rand -base64 172 | tr -d '\ n' " and copy the string]
NEXTAUTH_URL=http://localhost:3000
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


