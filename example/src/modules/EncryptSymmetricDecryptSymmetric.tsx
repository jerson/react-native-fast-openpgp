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

export default function ({passphrase}: Props) {

    const [input, setInput] = useState('');
    const [encrypted, setEncrypted] = useState('');
    const [decrypted, setDecrypted] = useState('');

    return <Container>
        <SectionContainer>
            <SectionTitle>Encrypt Symmetric</SectionTitle>
            <TextInput
                value={input}
                onChangeText={(text) => {
                    setInput(text);
                }}
                style={{backgroundColor: Colors.white, borderRadius: 4}}
                placeholder={"insert message here"}
            />
            <Button
                title={"Encrypt Symmetric"}
                onPress={async () => {
                    const output = await OpenPGP.encryptSymmetric(
                        input,
                        passphrase
                    );
                    setEncrypted(output);
                }}
            />
            <SectionResult>{encrypted}</SectionResult>
        </SectionContainer>
        {!!encrypted && (
            <SectionContainer>
                <SectionTitle>Decrypt Symmetric</SectionTitle>
                <Button
                    title={"Decrypt Symmetric"}
                    onPress={async () => {
                        const output = await OpenPGP.decryptSymmetric(
                            encrypted,
                            passphrase
                        );
                        setDecrypted(output);
                    }}
                />
                {!!decrypted && (
                    <SectionResult>
                        {decrypted}
                    </SectionResult>
                )}
            </SectionContainer>
        )}
    </Container>;
}