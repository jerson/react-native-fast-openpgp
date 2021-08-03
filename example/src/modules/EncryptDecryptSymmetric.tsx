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

    return <Container testID={'encrypt-decrypt-symmetric'}>
        <SectionContainer testID={'encrypt'}>
            <SectionTitle>Encrypt Symmetric</SectionTitle>
            <TextInput
                value={input}
                testID={'message'}
                onChangeText={(text) => {
                    setInput(text);
                }}
                style={{backgroundColor: Colors.white, borderRadius: 4}}
                placeholder={"insert message here"}
            />
            <Button
                title={"Encrypt Symmetric"}
                testID={'button'}
                onPress={async () => {
                    const output = await OpenPGP.encryptSymmetric(
                        input,
                        passphrase
                    );
                    setEncrypted(output);
                }}
            />
            {!!encrypted && <SectionResult testID={'result'}>{encrypted}</SectionResult>}
        </SectionContainer>
        {!!encrypted && (
            <SectionContainer testID={'decrypt'}>
                <SectionTitle>Decrypt Symmetric</SectionTitle>
                <Button
                    title={"Decrypt Symmetric"}
                    testID={'button'}
                    onPress={async () => {
                        const output = await OpenPGP.decryptSymmetric(
                            encrypted,
                            passphrase
                        );
                        setDecrypted(output);
                    }}
                />
                {!!decrypted && (
                    <SectionResult testID={'result'}>
                        {decrypted}
                    </SectionResult>
                )}
            </SectionContainer>
        )}
    </Container>;
}