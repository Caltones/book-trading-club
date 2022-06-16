import ResponsiveAppBar from '../../components/ResponsiveAppBar';
import { useSession, signIn, signOut } from 'next-auth/react';
import Head from 'next/head';
import Books_model from '../../models/Books';
import dbConnect from '../../lib/dbConnect';
import Users_model from '../../models/Users';
import Link from 'next/link';
import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useRouter, reload } from 'next/router';
import {
  DialogActions,
  Dialog,
  DialogTitle,
  Button,
  Breadcrumbs,
  List,
  Accordion,
  AccordionSummary,
  AccordionActions,
  AccordionDetails,
  Typography,
  Snackbar,
  DialogContent,
  DialogContentText,
  TextField,
  Alert,
  Autocomplete,
} from '@mui/material';
import { useState } from 'react';
const axios = require('axios').default;
export default function Name({ books, name }) {
  const [open, setOpen] = useState(false);
  const [snackBarStr, setSncakBarStr] = useState('');
  const [dialogopen, setDialogOpen] = useState(false);
  const [availiableBooks, setAvailiableBooks] = useState([]);
  const [targetOwner, setTargetOwner] = useState('');
  const [targetBookName, setTargetBookName] = useState('');
  const [value, setValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const { data: session } = useSession();
  const router = useRouter();
  const handleClose = () => {
    setDialogOpen(false);
  };
  const snackBarStringHandler = (situation) => {
    if (!session) return 'Please login first';
    if (situation === 'data.length === 0')
      return 'No book is here for trading...';
    if (situation === 'trading with yourself')
      return "You can't trade with youself!";
  };
  const removeHandler = (e) => {
    axios.post('/api/delete_book', { _id: e.target.id }).then(res=>{
      if (res.data.deletedCount===1){
        reload()
      }
    })
  };
  const submitHandler = () => {
    if (inputValue === '') return;
    console.log(books.filter((v) => v.name === targetBookName)[0]);
    axios
      .post('/api/makeRequest', {
        request_sender: session.user.name,
        bookId_that_give: availiableBooks.filter(
          (v) => v.name === inputValue
        )[0]['_id'],
        request_receiver: targetOwner,
        bookId_that_want: books.filter((v) => v.name === targetBookName)[0][
          '_id'
        ],
      })
      .then(({ data }) => {
        if (!!data?.err) {
          setOpen(true);
          setSncakBarStr('Only one request is allowed is a time');
        } else {
          router.push('/requests');
        }
      });
  };
  const requestHandler = (e) => {
    if (!session) return setOpen(true);
    const tempArr = e.target.id.split(',');

    if (session?.user?.name === tempArr[0]) {
      setOpen(true);
      setSncakBarStr(snackBarStringHandler('trading with yourself'));
      return;
    }
    setTargetOwner(tempArr[0]);
    setTargetBookName(tempArr[1]);
    axios.get(`/api/user/${session.user.name}`).then(({ data }) => {
      if (data.length === 0) {
        setOpen(true);
        setSncakBarStr(snackBarStringHandler('data.length === 0'));
        return;
      }
      setAvailiableBooks(data);
      setDialogOpen(true);
    });
  };
  return (
    <div>
      <Head>
        <title>{name}</title>
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
        <Link color="inherit" href="/">
          Homepage
        </Link>
        <Link color="inherit" href="/users">
          Users
        </Link>
        <Typography color="text.primary">{name}</Typography>
      </Breadcrumbs>
      <Typography sx={{ textAlign: 'center' }} variant="h5">
        Owned books:
      </Typography>
      {books.length === 0 ? (
        <Typography textAlign="center" variant="h6" color="#9e9e9e">
          Seems like nothing is here...
        </Typography>
      ) : (
        <List
          sx={{
            width: '60%',
            bgcolor: 'background.paper',
            margin: 'auto',
          }}
        >
          {books.map((v, i) => (
            <Accordion key={i}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ mr: 'auto' }} variant="subtitle1">
                  {v.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {v.author}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle2">Description:</Typography>
                <Typography color={v.description ? '#000' : '#9e9e9e'}>
                  {v.description || 'seems like no description in it'}
                </Typography>
              </AccordionDetails>
              <AccordionActions>
                {session?.user?.name === name ? (
                  <Button
                    id={v._id}
                    variant="outlined"
                    color="error"
                    endIcon={<DeleteOutlineIcon />}
                    onClick={removeHandler}
                  >
                    Remove
                  </Button>
                ) : (
                  ''
                )}
                <Button
                  id={`${v.owner},${v.name}`}
                  variant="outlined"
                  endIcon={<SendIcon />}
                  onClick={requestHandler}
                >
                  Make request
                </Button>
              </AccordionActions>
            </Accordion>
          ))}
        </List>
      )}
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
            isOptionEqualToValue={(option, itemvalue) =>
              option.id === itemvalue.id
            }
            sx={{ mt: 3 }}
            options={availiableBooks.map((v) => v.name) ?? []}
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

export async function getStaticProps(req) {
  // Fetch data from external API
  let bookdata = await Books_model.find({ owner: req.params.name }).sort({ bumped_on: -1 });
  return {
    props: {
      books: JSON.parse(JSON.stringify(bookdata)),
      name: req.params.name,
    },
  };
}
export async function getStaticPaths() {
  await dbConnect();
  const arr = [];
  let userdata = await Users_model.find({}).select('name -_id');
  userdata.forEach((v) => {
    arr.push({ params: v });
  });
  return {
    paths: arr,
    fallback: false, // true or 'blocking'
  };
}
