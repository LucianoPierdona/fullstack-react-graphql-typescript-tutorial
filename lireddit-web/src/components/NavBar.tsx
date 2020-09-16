import { Box, Button, Flex, Link } from '@chakra-ui/core';
import React from 'react';
import NextLink from 'next/link';

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{data, fetching}] = useMeQuery();
    let body = null;

    // data is loading
    if (fetching) {
        body = null;
    } else if (!data?.me) { // user not logged in
        body = (
            <>
                <NextLink href="/login">
                    <Link color="white" mr={2}>
                        Login
                    </Link>
                </NextLink>
                <NextLink href="/register">
                    <Link color="white">
                        Register
                    </Link>
                </NextLink>
            </>
        )
    } else { // user is logged in
        body = (
            <Flex>
                <Box mr={2}>{data.me.username}</Box>
                <Button variant="link">Logout</Button>
            </Flex>
        )
    }
    return (
        <Flex bg="tomato" p={4}>
            <Box ml={'auto'}>
                {body}
            </Box>
        </Flex>
    );
}