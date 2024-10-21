import React, { useRef, type ChangeEvent } from 'react';
import { TransitionGroup } from 'react-transition-group';

import { Box } from '@mui/system';
import { Fade, Zoom, Button, IconButton, Typography } from '@mui/material';

import { useLanguage } from 'src/contexts/language-context';

import Iconify from 'src/components/iconify';

import styles from './file-upload.module.css';

interface FileUploadProps {
  setFiles: (value: File[] | ((prevVar: File[]) => File[])) => void;
  files: File[];
}

export default function FileUpload(props: FileUploadProps): React.JSX.Element {
  const { renderLanguage } = useLanguage();

  const { setFiles, files } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles: FileList | null = event.target.files;

    if (uploadedFiles) {
      const filesArray: File[] = Array.from(uploadedFiles);

      setFiles(filesArray); // Update files state with the array of files
    }
  };

  const handleChoose = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleDelete = (index: number) => {
    const newFiles = files.filter((_, idx) => idx !== index);
    setFiles(newFiles);
  };

  return (
    <Fade in>
      <Box className={styles.fileUpload}>
        <Box className={styles.uploadContainer}>
          <input
            ref={inputRef}
            className={styles.uploadInput}
            type="file"
            multiple
            onChange={handleFileChange}
            accept=".mov,.mp4, .jpeg, .png, .jpg"
            style={{ display: 'none' }}
          />
          <Button
            variant="contained"
            onClick={handleChoose}
            // startIcon={<CloudUploadIcon />}
            className={styles.uploadButton}
          >
            {renderLanguage('ატვირთვა', 'Upload')}
          </Button>
          {files.length > 0 && (
            <Button
              variant="contained"
              color="warning"
              onClick={() => {
                setFiles([]);
              }}
              className={styles.uploadButton}
              sx={{ marginTop: '20px' }}
            >
              {renderLanguage('გასუფთავება მთლიანად', 'Delete All')}
            </Button>
          )}
          {files.length > 0 ? (
            <Box>
              <TransitionGroup className={styles.uploadItems} >
                {files.map((file, idx) => (
                  <Zoom key={file.name}>
                    <Box className={styles.uploadItem}>
                      <Box className={styles.uploadItemActions}>
                        <IconButton
                          onClick={() => {
                            handleDelete(idx);
                          }}
                        >
                         <Iconify icon="carbon:delete" />
                        </IconButton>
                      </Box>
                      {file.type.includes('image') ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className={styles.uploadImage}
                        />
                      ) : (
                        <video className={styles.uploadVideo} controls>
                          <source src={URL.createObjectURL(file)} type={file.type} />
                          <track
                            src="captions_en.vtt"
                            kind="captions"
                            srcLang="en"
                            label="english_captions"
                          />
                          <track
                            src="captions_es.vtt"
                            kind="captions"
                            srcLang="es"
                            label="spanish_captions"
                          />
                        </video>
                      )}
                      <Typography className={styles.textElipsis}>{file.name}</Typography>
                    </Box>
                  </Zoom>
                ))}
              </TransitionGroup>
            </Box>
          ) : null}
        </Box>
      </Box>
    </Fade>
  );
}
