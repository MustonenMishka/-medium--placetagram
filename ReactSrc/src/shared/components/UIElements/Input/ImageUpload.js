import React, {useEffect, useRef, useState} from 'react';

import styles from './ImageUpload.module.scss';
import Button from "../Button/Button";
import Avatar from "../Cards/Avatar/Avatar";

const ImageUpload = props => {
    const filePickerRef = useRef();
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);

    const pickImageHandler = () => {
        filePickerRef.current.click();
    }

    useEffect(() => {
        if (file) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setPreviewUrl(fileReader.result);
            };
            fileReader.readAsDataURL(file)
        }
    }, [file])

    const pickedFileHandler = e => {
        let pickedFile;
        let fileIsValid = isValid;
        if (e.target.files && e.target.files.length === 1) {
            pickedFile = e.target.files[0]
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid = true;
        } else {
            setIsValid(false);
            fileIsValid = false;
        }
        props.onInput(props.id, pickedFile, fileIsValid);
    }

    return (
        <div className={styles.FormControl}>
            <input id={props.id} onChange={pickedFileHandler} ref={filePickerRef} type="file" accept=".jpg,.png,.jpeg"/>
            <Avatar alt="Preview" width="100%" square={!!props.square}
                    image={previewUrl || "https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331257__340.png"}/>
            <Button type="button" onClick={pickImageHandler} borderless inverse={!!props.buttonInverse}>Pick image</Button>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    );
}

export default ImageUpload