import Head from 'next/head';
import ResponsiveAppBar from '../components/ResponsiveAppBar.jsx';
import { useSession, signIn, signOut } from 'next-auth/react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { request } from '@octokit/request';
import { useRouter } from 'next/router';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
export default function Create() {
  const { data: session } = useSession({required:true,onUnauthenticated(){
    router.push('/api/auth/signin')
  }});
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [bookName, setBookName] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const regex4wordcount = /[a-z0-9]+/gi;
  const replaceTwoOrMoreSpace = /\s{2,}/g;
  const descriptionHandler = (e) => {
    const wordcount = e.target.value.match(regex4wordcount)?.length ?? 0;
    if (wordcount > 20) return;
    setDescription(e.target.value);
  };
  const submitHandler = async () => {
    if(!author || !bookName) return
    if (!session) {
      return setOpen(true);
    }
    const result = await request(`POST /api/listing/${session?.user?.name}`, {
      baseUrl: 'http://localhost:3000',
      description: description.trim().replace(replaceTwoOrMoreSpace, ' ') ?? '',
      author: author,
      bookName: bookName,
    });
    if (result?.data?.owner === session?.user?.name) {
      router.push('/');
    } else {
      setOpen(true);
    }
  };

  return (
    <div>
      <Head>
        <title>Listing Books</title>
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
      <Box
        component="form"
        autoComplete="off"
        sx={{ mt: 10, width: '40vw', mx: 'auto' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <TextField
            error={bookName.length <= 0}
            required
            label="Name"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
            helperText={bookName.length <= 0 ? 'Required' : ''}
          />
          <TextField
            error={author.length <= 0}
            required
            label="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            helperText={author.length <= 0 ? 'Required' : ''}
          />
          <TextField
            label="Description"
            multiline
            placeholder="Optional(20 words max)"
            rows={4}
            value={description}
            onChange={descriptionHandler}
          />
          <Button
            sx={{ padding: 0 }}
            size="large"
            variant="outlined"
            onClick={submitHandler}
            endIcon={<SaveAltIcon />}
          >
            List
          </Button>
        </div>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={() => setOpen(false)}
        message="An error occured, please try again..."
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={session ? 'error' : 'warning'}
          sx={{ width: '100%' }}
        >
          {session
            ? 'An error occured, please try again...'
            : 'Please Login first'}
        </Alert>
      </Snackbar>
    </div>
  );
}
