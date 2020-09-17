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

interface registerProps {

}

const REGISTER_MUTATION = `
  mutation Register($username: String!, $password: String!) {
    register(options: { username: $username, password: $password }) {
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
`

const Register: React.FC<registerProps> = ({}) => {
    const router = useRouter();
    const [,register] = useMutation(REGISTER_MUTATION);

    return (
      <Wrapper variant="small">
        <Formik 
          initialValues={{ email: '', username: "", password: "" }} 
          onSubmit={async (values, {setErrors}) => {
            const response = await register({options: values});
            if (response.data?.register.errors) {
              setErrors({
                setErrors(toErrorMap)
              })
            } else if (response.data?.register.user) {
              // worked
              router.push('/');
            }
          }}
        >
          {() => (
            <Form>
                <InputField
                  name="username"
                  placeholder="username"
                  label="Username"
                />
              <Box mt={4}>
                <InputField
                  name="email"
                  placeholder="email"
                  label="email"
                />
              </Box>
              <Box mt={4}>
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password"
                />
              </Box>
              <Button mt={4} type="submit" variantColor='white'>Register</Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    );
}

export default withUrqlClient(createUrqlClient)(Register);
