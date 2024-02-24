import {
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Anchor,
  Text,
  Alert,
} from '@mantine/core';
import { ActionFunctionArgs } from '@remix-run/node';
import { useForm } from '@conform-to/react';
import { z } from 'zod';
import { parseWithZod } from '@conform-to/zod';
import { Form, Link, useActionData } from '@remix-run/react';
import { prisma } from '~/services/db/db.server';
import bcrypt from 'bcryptjs';
const { compare } = bcrypt;

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
});

async function login({ email, password }: z.infer<typeof loginSchema>) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      password: true,
    },
  });
  if (!user || !user.password) return false;
  const isMatched = await compare(password, user.password?.hash);
  return isMatched;
}

// Todo: Set the session and redirect
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: loginSchema });
  if (submission.status !== 'success') {
    return submission.reply();
  }
  const isLoggedIn = await login(submission.value);
  if (!isLoggedIn) {
    return submission.reply({
      formErrors: ['Incorrect username or password'],
    });
  }
  return null;
}

export default function Login() {
  const lastResult = useActionData<typeof action>();

  // Todo: Make a reusable useForm
  const [form, { email, password }] = useForm({
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: loginSchema });
    },
  });
  return (
    <Form
      method='post'
      id={form.id}
      onSubmit={form.onSubmit}
    >
      {form.errors && (
        <Alert
          variant='filled'
          color='red'
        >
          {form.errors}
        </Alert>
      )}
      <TextInput
        label='Email address'
        placeholder='hello@gmail.com'
        size='md'
        name={email.name}
        error={email.errors}
      />
      <PasswordInput
        label='Password'
        placeholder='Your password'
        mt='md'
        size='md'
        name={password.name}
        error={password.errors}
      />
      <Checkbox
        label='Keep me logged in'
        mt='xl'
        size='md'
      />
      <Button
        fullWidth
        mt='xl'
        size='md'
        type='submit'
      >
        Login
      </Button>

      <Text
        ta='center'
        mt='md'
      >
        Don&apos;t have an account?{' '}
        <Anchor
          component={Link}
          to='/register'
          fw={700}
        >
          Register
        </Anchor>
      </Text>
    </Form>
  );
}
