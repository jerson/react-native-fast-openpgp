import {Colors} from "react-native/Libraries/NewAppScreen";
import {Button, TextInput} from "react-native";
import React, {useState} from "react";
import OpenPGP from 'react-native-fast-openpgp';
import SectionContainer from "../components/SectionContainer";
import SectionTitle from "../components/SectionTitle";
import SectionResult from "../components/SectionResult";
import Container from "../components/Container";

interface Props {
    privateKey: string
}

export default function ({privateKey}: Props) {

    const [output, setOutput] = useState('');

    return <Container testID={'convert-all'}>
        <SectionContainer testID={'convert'}>
            <SectionTitle>Convert</SectionTitle>
            <Button
                title={"convertPrivateKeyToPublicKey"}
                testID={'button'}
                onPress={async () => {
                    const output = await OpenPGP.convertPrivateKeyToPublicKey(privateKey);
                    setOutput(output);
                }}
            />
            {!!output && <SectionResult testID={'result'}>{output}</SectionResult>}
        </SectionContainer>
        
    </Container>;
}
