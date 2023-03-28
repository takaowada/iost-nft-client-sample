import { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { iosUtil } from './iosUtil';
import './App.css';

interface Token {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
}

interface TransferToken {
  id: number;
  toAccount: string;
}

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
    width: 100,
  },
  {
    field: 'name',
    headerName: '名前',
    width: 200,
  },
  {
    field: 'category',
    headerName: 'カテゴリー',
    width: 100,
  },
  {
    field: 'imageUrl',
    headerName: '画像URL',
    width: 200,
  },
];

function App() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [response, setResponse] = useState<string>('');
  const [err, setErr] = useState<string>('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TransferToken>({
    defaultValues: {
      id: 1,
      toAccount: ''
    },
  });

  useEffect(() => {
    const f = async () => {
      try {
        await iosUtil.init();
        const tokens = await iosUtil.getTokens(iosUtil.getAccount().getID());
        setTokens(tokens);
        console.log('tokens', tokens);
      } catch (e) {
        console.log(e);
        setErr('iWalletを開いて、ログイン後、リロードしてください');
      }
    };
    f();
  }, []);

  const validationRules = {
    id: {
      required: 'IDを入力してください。',
      min: { value: 0, message: '0以上で入力してください。' },
      max: { value: 19999999, message: '9999999以下で入力してください。' },
    },
    toAccount: {
      required: '転送先アカウントを入力してください。',
    },
  };

  const onSubmit: SubmitHandler<TransferToken> = async (data: TransferToken) => {
    console.log('data', data);
    const handler = await iosUtil.transferToken(
      Number(data.id),
      data.toAccount,
    );
    handler
      .on('pending', () => {
        console.log('Start tx.');
      })
      .on('success', async (response: any) => {
        console.log('Success... tx', response);
        setResponse(JSON.stringify(response));
        console.log('response', JSON.stringify(response));
        const tokens = await iosUtil.getTokens(iosUtil.getAccount().getID());
        setTokens(tokens);
      })
      .on('failed', (err: any) => {
        console.log('failed: ', err);
        setResponse(JSON.stringify(err));
        console.log('response', JSON.stringify(err));
      });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          所有NFT一覧
        </Typography>
        {err && <Alert severity="error">{err}</Alert>}
      </Box>
      <Divider variant="middle" />
      <Box sx={{ height: 400, width: '100%' }}>
        <Typography variant="h5" component="h1" gutterBottom>
          作成済みNFT一覧
        </Typography>
        <DataGrid
          rows={tokens}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
      <br/>
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          NFTの発行
        </Typography>
        {err && <Alert severity="error">{err}</Alert>}
        <Stack
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          spacing={2}
          sx={{ m: 2, width: '25ch' }}
        >
          <Controller
            name="id"
            control={control}
            rules={validationRules.id}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                id="outlined-number"
                label="トークンID"
                error={errors.id !== undefined}
                helperText={errors.id?.message}
              />
            )}
          />
          <Controller
            name="toAccount"
            control={control}
            rules={validationRules.toAccount}
            render={({ field }) => (
              <TextField
                {...field}
                type="text"
                label="転送先アカウント"
                error={errors.toAccount !== undefined}
                helperText={errors.toAccount?.message}
              />
            )}
          />
          <Button variant="contained" type="submit">
            転送
          </Button>
        </Stack>
      </Box>
      <br/>
      <Box
        sx={{
          '& .MuiTextField-root': { m: 1, width: '100%' },
        }}
      >
        <TextField
          id="response"
          multiline
          defaultValue={response}
          InputProps={{
            readOnly: true,
          }}
          variant="outlined"
        />
      </Box>
      <br />
    </Container>
  );
}

export default App;
