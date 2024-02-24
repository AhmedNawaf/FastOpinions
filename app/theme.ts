import { createTheme, Button, rem } from '@mantine/core';

export const theme = createTheme({
  components: {
    Button: Button.extend({
      vars: (theme, props) => {
        switch (props.size) {
          case 'xxl':
            return {
              root: {
                '--button-height': rem(60),
                '--button-padding-x': rem(30),
                '--button-fz': rem(24),
              },
            };
          case 'xxs':
            return {
              root: {
                '--button-height': rem(24),
                '--button-padding-x': rem(10),
                '--button-fz': rem(10),
              },
            };
        }
        return {
          root: {},
        };
      },
    }),
  },
});
