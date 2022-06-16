import Head from 'next/head';
import ResponsiveAppBar from '../components/ResponsiveAppBar.jsx';
import { useSession, signIn, signOut } from 'next-auth/react';
import dbConnect from '../lib/dbConnect.js';
import books_model from '../models/Books';
import users_model from '../models/Users';
import Link from 'next/link';
import {
  List,
  ListItem,
  Button,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Autocomplete,
  TextField,
  Typography
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';
import { useRouter } from 'next/router.js';

const axios = require('axios').default;
export default function Home({ books, users }) {
  const router = useRouter()
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [snackBarStr, setSncakBarStr] = useState('');
  const [dialogopen, setDialogOpen] = useState(false);
  const [availiableBooks, setAvailiableBooks] = useState([]);
  const [targetOwner,setTargetOwner] = useState('')
  const [targetBookName, setTargetBookName] = useState('')
  const [value, setValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const handleClose = () => {
    setDialogOpen(false);
  };
  const findPfpbyname = (name) => {
    return users.filter((v) => v.name === name)[0]?.image;
  };
  const submitHandler = () => {
    if (inputValue === '') return;
    axios.post('/api/makeRequest',{
      request_sender : session.user.name,
      bookId_that_give : books.filter((v)=>v.name===inputValue)[0]['_id'],
      request_receiver : targetOwner,
      bookId_that_want : books.filter((v)=>v.name===targetBookName)[0]['_id']
    }).then(({data})=>{
      if(!!data?.err){
        setOpen(true)
        setSncakBarStr('Only one request is allowed at a time')
      }else{
        router.push('/requests')
      }
    })
  };
  const requestHandler = (e) => {
    if (!session) { 
      setOpen(true)
      setSncakBarStr('Please login first!');
      return
    }
    const tempArr = e.target.id.split(',');
    console.log(session?.user?.name , tempArr[0])
    if (session?.user?.name === tempArr[0]) {
      setOpen(true);
      setSncakBarStr("You can't trade with youself!");
      return;
    }
    setTargetOwner(tempArr[0])
    setTargetBookName(tempArr[1])
    axios.get(`/api/user/${session.user.name}`).then(({ data }) => {
      if (data.length === 0) {
        setOpen(true);
        setSncakBarStr('No book is here for trading...');
        return;
      }
      setAvailiableBooks(data);
      setDialogOpen(true);
    });
  };
  return (
    <div>
      <Head>
        <title>Homepage</title>
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
      <List>
        {books.map((v, i) => (
          <ListItem
            sx={{ flexWrap: 'wrap' }}
            key={i}
            secondaryAction={
              <Button
                sx={{ top: 10 }}
                onClick={requestHandler}
                variant="outlined"
                endIcon={<SendIcon />}
                id={`${v.owner},${v.name}`}
              >
                Send Request
              </Button>
            }
          >
            <ListItemAvatar>
              <Avatar alt={v.owner} src={findPfpbyname(v.owner)}></Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<><Typography color='Highlight' ><Link href={`user/${v.owner}`}>{v.owner}</Link></Typography><Typography>{new Date(v.bumped_on).toDateString()}</Typography></>}
              secondary={`Listed a book---${v.name}`}
            ></ListItemText>
          </ListItem>
        ))}
      </List>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={() => setOpen(false)}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={session ? 'info' : 'warning'}
          sx={{ width: '100%' }}
        >
          {snackBarStr}
        </Alert>
      </Snackbar>
      <Dialog open={dialogopen} onClose={handleClose} fullWidth>
        <DialogTitle>Trade</DialogTitle>
        <DialogContent>
          <DialogContentText>Select one of your books</DialogContentText>
          <Autocomplete
            value={value}
            inputValue={inputValue}
            onChange={(_event, newValue) => {
              setValue(newValue);
            }}
            onInputChange={(_event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            isOptionEqualToValue={(option, itemvalue) => option.id === itemvalue.id}
            sx={{ mt: 3 }}
            options={availiableBooks.map((v) => v.name)??[]}
            renderInput={(params) => <TextField {...params} label="Books" />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={submitHandler}>Request</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export async function getServerSideProps() {
  await dbConnect();
  let bookdata = await books_model.find({}).sort({ bumped_on: -1 });
  let userdata = await users_model.find({}).select('image name -_id');
  return {
    props: {
      books: JSON.parse(JSON.stringify(bookdata)),
      users: JSON.parse(JSON.stringify(userdata)),
    }, // will be passed to the page component as props
  };
}
