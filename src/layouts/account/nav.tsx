import { useRef, useState, useEffect } from 'react';
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from 'firebase/storage';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';

import { paths } from 'src/routes/paths';
import { useActiveLink } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import { storage } from 'src/firebase/firebase';
import { StorageName } from 'src/enums/storage-enum';
import { useAuthContext } from 'src/contexts/auth-context';

import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';
import axios from 'axios';
import { Skeleton } from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';

// ----------------------------------------------------------------------

const navigations = [
  {
    title: 'Personal Info',
    path: paths.eCommerce.account.personal,
    icon: <Iconify icon="carbon:user" />,
  },
  {
    title: 'My tours',
    path: paths.eCommerce.account.wishlist,
    icon: <Iconify icon="carbon:favorite" />,
  },
  {
    title: 'Add Tour',
    path: paths.eCommerce.account.addTour,
    icon: <Iconify icon="carbon:cut-out" />,
  },
];

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
};

interface UserPhoto {
  image_name: string;
  image_url: string;
}

export default function Nav({ open, onClose }: Props) {
  const mdUp = useResponsive('up', 'md');

  const { logout } = useAuthContext();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { user } = useAuthContext();

  const [userPhoto, setUserPhoto] = useState<UserPhoto>({
    image_name: '',
    image_url: '',
  });

  const loadingImageUpload = useBoolean(false);

  useEffect(() => {
    setUserPhoto({
      image_name: user?.profile_picture || '',
      image_url: user?.profile_picture_url || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the selected file
    if (user && user.profile_picture) {
      try {
        const photoRef = ref(
          storage,
          `${StorageName.CompanyProfileImages}/${user.profile_picture}`
        );

        await deleteObject(photoRef);
      } catch (error) {
        console.log(error);
      }
    }
    loadingImageUpload.setValue(true);
    const uploadedFilePromise: Promise<UserPhoto | null> = new Promise((resolve, reject) => {
      const storageName = StorageName.CompanyProfileImages;
      const uuid = new Date().getTime().toString();

      if (file) {
        const imageRef = ref(storage, `${storageName}/${file.name}${uuid}`);
        const metadata = { contentType: file.type };
        const uploadTask = uploadBytesResumable(imageRef, file, metadata);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
              default:
                break;
            }
          },
          (error) => reject(error),
          async () => {
            try {
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({
                image_name: `${file.name}${uuid}`,
                image_url: downloadUrl,
              });
            } catch (error) {
              reject(error);
            }
          }
        );
      } else {
        resolve(null);
      }
    });

    const uploadedFile = await uploadedFilePromise;

    if (uploadedFile) {
      await axios.patch(
        `/api/company`,
        { profile_picture: uploadedFile.image_name, profile_picture_url: uploadedFile.image_url },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      setUserPhoto({
        image_name: uploadedFile.image_name,
        image_url: uploadedFile.image_url,
      });
      loadingImageUpload.setValue(false);
    }
    loadingImageUpload.setValue(false);
  };

  const renderContent = (
    <Stack
      sx={{
        flexShrink: 0,
        borderRadius: 2,
        width: 1,
        ...(mdUp && {
          width: 280,
          border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.24)}`,
        }),
      }}
    >
      <Stack spacing={2} sx={{ p: 3, pb: 2 }}>
        <Stack spacing={2} direction="row" alignItems="center">
          {loadingImageUpload.value ? (
            <Skeleton sx={{ width: 64, height: 64, borderRadius: '100px' }} />
          ) : (
            <Avatar src={userPhoto.image_url} sx={{ width: 64, height: 64 }} />
          )}

          <Stack
            direction="row"
            alignItems="center"
            sx={{
              typography: 'caption',
              cursor: 'pointer',
              '&:hover': { opacity: 0.72 },
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <Iconify icon="carbon:edit" sx={{ mr: 1 }} />
            Change photo
          </Stack>
        </Stack>

        <Stack spacing={0.5}>
          <TextMaxLine variant="subtitle1" line={1}>
            {user ? user.name : 'User Name'}
          </TextMaxLine>
          <TextMaxLine variant="body2" line={1} sx={{ color: 'text.secondary' }}>
            {user ? user.email : 'User Email'}
          </TextMaxLine>
        </Stack>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Stack sx={{ my: 1, px: 2 }}>
        {navigations.map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
      </Stack>
      <input
        type="file"
        accept="image/*" // Accept image files only
        ref={fileInputRef}
        style={{ display: 'none' }} // Hide the input
        onChange={handleFileChange} // Handle file change
      />

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Stack sx={{ my: 1, px: 2 }}>
        <ListItemButton
          sx={{
            px: 1,
            height: 44,
            borderRadius: 1,
          }}
        >
          <ListItemIcon>
            <Iconify icon="carbon:logout" />
          </ListItemIcon>
          <ListItemText
            onClick={logout}
            primary="Logout"
            primaryTypographyProps={{
              typography: 'body2',
            }}
          />
        </ListItemButton>
      </Stack>
    </Stack>
  );

  return (
    <>
      {mdUp ? (
        renderContent
      ) : (
        <Drawer
          open={open}
          onClose={onClose}
          PaperProps={{
            sx: {
              width: 280,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

type NavItemProps = {
  item: {
    title: string;
    path: string;
    icon: React.ReactNode;
  };
};

function NavItem({ item }: NavItemProps) {
  const active = useActiveLink(item.path);

  return (
    <Link
      component={RouterLink}
      key={item.title}
      href={item.path}
      color={active ? 'primary' : 'inherit'}
      underline="none"
    >
      <ListItemButton
        sx={{
          px: 1,
          height: 44,
          borderRadius: 1,
        }}
      >
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText
          primary={item.title}
          primaryTypographyProps={{
            typography: 'body2',
            ...(active && {
              typography: 'subtitle2',
            }),
          }}
        />
      </ListItemButton>
    </Link>
  );
}
