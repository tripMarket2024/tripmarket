import { Media } from '@prisma/client';
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
  exsistingFiles?: Media[];
  setExsistingFiles?: (value: Media[] | ((prevVar: Media[]) => Media[])) => void;
}

export default function FileUpload(props: FileUploadProps): React.JSX.Element {
  const { renderLanguage } = useLanguage();

  const { setFiles, files, exsistingFiles, setExsistingFiles } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles: FileList | null = event.target.files;

    if (uploadedFiles) {
      const filesArray: File[] = Array.from(uploadedFiles);

      setFiles(filesArray);
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

  const handleDeleteExsistingFiles = (id: string) => {
    if (!exsistingFiles) return;
    const newExsistingFiles = exsistingFiles?.filter((file) => file.id !== id);
    if (setExsistingFiles) {
      setExsistingFiles(newExsistingFiles);
    }
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
            accept=".jpeg, .png, .jpg"
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
                if (setExsistingFiles) {
                  setExsistingFiles([]);
                }
              }}
              className={styles.uploadButton}
              sx={{ marginTop: '20px' }}
            >
              {renderLanguage('გასუფთავება მთლიანად', 'Delete All')}
            </Button>
          )}
          {files.length > 0 ? (
            <Box>
              <TransitionGroup className={styles.uploadItems}>
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
          {exsistingFiles && exsistingFiles.length > 0 ? (
            <Box>
              <TransitionGroup className={styles.uploadItems}>
                {exsistingFiles.map((file) => (
                  <Zoom key={file.id}>
                    <Box className={styles.uploadItem}>
                      <Box className={styles.uploadItemActions}>
                        <IconButton
                          onClick={() => {
                            handleDeleteExsistingFiles(file.id);
                          }}
                        >
                          <Iconify icon="carbon:delete" />
                        </IconButton>
                      </Box>
                      {file.type.includes('image') ? (
                        <img src={file.url} alt={file.image_name} className={styles.uploadImage} />
                      ) : (
                        <video className={styles.uploadVideo} controls>
                          <source src={file.url} type={file.type} />
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
                      <Typography className={styles.textElipsis}>{file.image_name}</Typography>
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
