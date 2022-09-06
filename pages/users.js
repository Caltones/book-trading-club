import ResponsiveAppBar from '../components/ResponsiveAppBar.jsx';
import { useSession, signIn, signOut } from 'next-auth/react';
import Head from 'next/head';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Users_model from '../models/Users';
import Books_model from '../models/Books';
import dbConnect from '../lib/dbConnect';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from 'next/link';
export default function Users({ books, users }) {
  const { data: session } = useSession();
  return (
    <div>
      <Head>
        <title>Users</title>
        <meta name="description" content="Book Trading Club" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <ResponsiveAppBar
        name={session?.user?.name}
        pfp={session?.user?.image}
        session={session}
        signIn={signIn}
        signOut={signOut}
      />
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          Homepage
        </Link>
        <Typography color="text.primary">Users</Typography>
      </Breadcrumbs>
      <List
        sx={{
          width: '50%',
          bgcolor: 'background.paper',
          margin: 'auto',
        }}
      >
        {users.map((v, i) => (
          <Link key={i} href={`/user/${v.name}`}>
            <ListItem
              button
              divider
              
            >
              <ListItemAvatar>
                <Avatar alt={v.name} src={v.image} />
              </ListItemAvatar>
              <ListItemText
                primary={v.name}
                secondary={`Owned book : ${
                  books.filter((item) => item.owner === v.name).length
                }`}
              />
            </ListItem>
          </Link>
        ))}
      </List>
    </div>
  );
}

export async function getServerSideProps() {
  // Fetch data from external API
  await dbConnect();
  let userdata = await Users_model.find({}).select('name image');
  let bookdata = await Books_model.find({}).select('-_id');
  return {
    props: {
      users: JSON.parse(JSON.stringify(userdata)),
      books: JSON.parse(JSON.stringify(bookdata)),
    },
  };
}
