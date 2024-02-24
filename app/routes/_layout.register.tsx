import { TextInput, PasswordInput, Button, Anchor, Text } from '@mantine/core';
import { ActionFunctionArgs } from '@remix-run/node';
import { useForm } from '@conform-to/react';
import { z } from 'zod';
import { parseWithZod } from '@conform-to/zod';
import { Form, Link, useActionData } from '@remix-run/react';
import { checkUser, createUser } from '~/models/user.server';

const registerSchema = z.object({
  name: z.string().min(4),
  email: z.string().email().max(256),
  password: z.string().min(8).max(20),
});

// Todo: Set the session and redirect
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: registerSchema });
  if (submission.status !== 'success') {
    return submission.reply();
  }
  const isUsed = await checkUser(submission.value.email);
  if (isUsed) {
    return submission.reply({
      fieldErrors: {
        email: ['This email is used'],
      },
    });
  }
  await createUser(submission.value);
  return null;
}

export default function RegisterRoute() {
  const lastResult = useActionData<typeof action>();

  // Todo: Make a reusable useForm
  const [form, { name, email, password }] = useForm({
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: registerSchema });
    },
  });
  return (
    <Form
      method='post'
      id={form.id}
      onSubmit={form.onSubmit}
    >
      <TextInput
        label='Name'
        placeholder='Your name'
        size='md'
        name={name.name}
        error={name.errors}
      />
      <TextInput
        label='Email address'
        placeholder='hello@gmail.com'
        size='md'
        mt='md'
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
      <Button
        fullWidth
        mt='xl'
        size='md'
        type='submit'
      >
        Register
      </Button>

      <Text
        ta='center'
        mt='md'
      >
        Already have an account?{' '}
        <Anchor
          component={Link}
          to='/login'
          fw={700}
        >
          Login
        </Anchor>
      </Text>
    </Form>
  );
}
