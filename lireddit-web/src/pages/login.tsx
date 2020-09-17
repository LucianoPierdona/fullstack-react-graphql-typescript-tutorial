import React from 'react';
import { Formik, Form } from 'formik';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { Box, Button } from '@chakra-ui/core';
import { useMutation } from 'urql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from "next/router"
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface loginProps {

}

const LOGIN_MUTATION = `
    mutation Login($options: UsernamePasswordInput! ) {
        login(options: $options) {
            errors {
                field
                message
            }
            user {
                id
                username
            }
        }
    }
`;

const Login: React.FC<loginProps> = ({}) => {
    const router = useRouter();
    const [,login] = useMutation(LOGIN_MUTATION);

    return (
      <Wrapper variant="small">
        <Formik 
          initialValues={{ usernameOrEmail: "", password: "" }} 
          onSubmit={async (values, {setErrors}) => {
            const response = await login(values);
            if (response.data?.login.errors) {
              setErrors({
                setErrors(toErrorMap)
              })
            } else if (response.data?.login.user) {
              // worked
              router.push('/');
            }
          }}
        >
          {() => (
            <Form>
                <InputField
                  name="usernameOrEmail"
                  placeholder="username or email"
                  label="Username Or Email"
                />
              <Box mt={4}>
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password"
                />
              </Box>
              <Button mt={4} type="submit" variantColor='white'>login</Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    );
}

export default withUrqlClient(createUrqlClient)(Login);
