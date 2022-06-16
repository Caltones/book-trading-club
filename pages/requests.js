import dbConnect from '../lib/dbConnect';
import request_model from '../models/Request';
import user_model from '../models/Users';
import book_model from '../models/Books';
import { useRouter, reload } from 'next/router';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import {
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  ButtonGroup,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
const axios = require('axios').default;

export default function Requests({
  requestsFromOther,
  books,
  users,
  requestsFromSelf,
}) {
  const router = useRouter();
  const findSrcByUserName = (name) => {
    return users.filter((v) => v.name === name)[0]?.image;
  };
  const findBookNamebyId = (id) => {
    return books.filter((v) => v._id === id)[0]?.name;
  };
  const cancelHandler = (e) => {
    axios.post('/api/delete', { _id: e.target.id }).then((res) => {
      if (res.data.deletedCount === 1) {
        reload();
      }
    });
  };
  const acceptHandler = (e) => {
    axios.put('/api/accept', { _id: e.target.id }).then(res=>{
      if(res.statusText==='OK'){
        reload()
      }
    });
  };
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/api/auth/signin');
    },
  });
  return (
    <div>
      <ResponsiveAppBar
        name={session?.user?.name}
        pfp={session?.user?.image}
        session={session}
        signIn={signIn}
        signOut={signOut}
      />
      <List>
        {requestsFromSelf.length > 0 ? (
          <Typography variant="h5" textAlign="center">
            My request
          </Typography>
        ) : (
          ''
        )}

        {requestsFromSelf.map((v, i) => (
          <ListItem
            key={i}
            secondaryAction={
              <Button
                id={v._id}
                onClick={cancelHandler}
                variant="outlined"
                endIcon={<CancelIcon />}
              >
                Cancel
              </Button>
            }
          >
            <ListItemAvatar>
              <Avatar
                alt={v.request_receiver}
                src={findSrcByUserName(v.request_receiver)}
              ></Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={v.request_receiver}
              secondary={
                <>
                  You offer a trade:
                  <Typography
                    color="red"
                    component="span"
                    sx={{ display: 'block' }}
                  >
                    - {findBookNamebyId(v.bookId_that_give)}
                  </Typography>
                  <Typography color="green" component="span">
                    + {findBookNamebyId(v.bookId_that_want)}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      {requestsFromOther.length > 0 ? (
        <Typography variant="h5" textAlign="center">
          Pending request
        </Typography>
      ) : (
        ''
      )}
      <List>
        {requestsFromOther.map((v, i) => (
          <ListItem
            key={i}
            secondaryAction={
              <ButtonGroup variant="outlined">
                <Button
                  id={v._id}
                  color="success"
                  endIcon={<DoneIcon />}
                  onClick={acceptHandler}
                >
                  accept
                </Button>
                <Button
                  id={v._id}
                  color="error"
                  endIcon={<ClearIcon />}
                  onClick={cancelHandler}
                >
                  reject
                </Button>
              </ButtonGroup>
            }
          >
            <ListItemAvatar>
              <Avatar
                alt={v.request_sender}
                src={findSrcByUserName(v.request_sender)}
              ></Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={v.request_sender}
              secondary={
                <>
                  Offer a trade:
                  <Typography
                    color="green"
                    component="span"
                    sx={{ display: 'block' }}
                  >
                    + {findBookNamebyId(v.bookId_that_give)}
                  </Typography>
                  <Typography color="red" component="span">
                    - {findBookNamebyId(v.bookId_that_want)}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      {requestsFromOther.length + requestsFromSelf.length === 0 ? (
        <Typography color="#9e9e9e" textAlign="center">
          Looks like nothing is here...
        </Typography>
      ) : (
        ''
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  await dbConnect();
  const session = await getSession(context);
  return {
    props: {
      requestsFromOther: JSON.parse(
        JSON.stringify(
          await request_model.find({
            request_receiver: session.user.name,
            accepted: false,
          })
        )
      ),
      requestsFromSelf: JSON.parse(
        JSON.stringify(
          await request_model.find({
            request_sender: session.user.name,
            accepted: false,
          })
        )
      ),
      books: JSON.parse(JSON.stringify(await book_model.find())),
      users: JSON.parse(JSON.stringify(await user_model.find())),
      session,
    },
  };
}
