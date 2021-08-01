import {Button} from "react-native";
import React, {useState} from "react";
import OpenPGP from 'react-native-fast-openpgp';
import SectionContainer from "../components/SectionContainer";
import SectionTitle from "../components/SectionTitle";
import SectionResult from "../components/SectionResult";
import Container from "../components/Container";

interface Props {
    publicKey: string,
    privateKey: string,
    passphrase: string
}

export default function ({}: Props) {

    const [keyPair, setKeyPair] = useState({publicKey: '', privateKey: ''});

    return <Container>
        <SectionContainer>
            <SectionTitle>Generate</SectionTitle>

            <Button
                title={"Generate"}
                onPress={async () => {
                    const output = await OpenPGP.generate({
                        name: 'test',
                        email: 'test@test.com',
                        passphrase: 'test',
                        keyOptions: {
                            rsaBits: 2048,
                        },
                    });
                    setKeyPair(output);
                }}
            />
            <SectionResult>PublicKey:{keyPair.publicKey}</SectionResult>
            <SectionResult>PrivateKey:{keyPair.privateKey}</SectionResult>
        </SectionContainer>

    </Container>;
}