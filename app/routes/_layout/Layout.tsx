import { Paper, Title } from '@mantine/core';
import classes from './Layout.module.css';

interface Props {
  heading: string;
  image: string;
  children: React.ReactNode;
}

export function AuthenticationLayout({ heading, image, children }: Props) {
  return (
    <div
      className={classes.wrapper}
      style={{
        backgroundImage: image,
      }}
    >
      <Paper
        className={classes.form}
        radius={0}
        p={30}
      >
        <Title
          order={2}
          className={classes.title}
          ta='center'
          mt='md'
          mb={50}
        >
          {heading}
        </Title>
        {children}
      </Paper>
    </div>
  );
}
