import {Colors} from "react-native/Libraries/NewAppScreen";
import {Button, TextInput} from "react-native";
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

export default function ({publicKey, privateKey, passphrase}: Props) {

    const [input, setInput] = useState('');
    const [signed, setSigned] = useState('');
    const [verified, setVerified] = useState(false);

    return <Container>
        <SectionContainer>
            <SectionTitle>Sign</SectionTitle>
            <TextInput
                value={input}
                onChangeText={(text) => {
                    setInput(text);
                }}
                style={{backgroundColor: Colors.white, borderRadius: 4}}
                placeholder={"insert message here"}
            />
            <Button
                title={"Sign"}
                onPress={async () => {
                    const output = await OpenPGP.sign(
                        input,
                        publicKey,
                        privateKey,
                        passphrase
                    );
                    setSigned(output);
                }}
            />
            <SectionResult>{signed}</SectionResult>
        </SectionContainer>
        {!!signed && (
            <SectionContainer>
                <SectionTitle>Verify</SectionTitle>
                <Button
                    title={"Verify"}
                    onPress={async () => {
                        const output = await OpenPGP.verify(
                            signed,
                            input,
                            publicKey
                        );

                        setVerified(output);
                    }}
                />
                {typeof verified !== 'undefined' && (
                    <SectionResult>
                        {verified ? 'valid' : 'invalid'}
                    </SectionResult>
                )}
            </SectionContainer>
        )}
    </Container>;
}