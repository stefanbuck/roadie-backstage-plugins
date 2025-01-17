import {
  Button,
  Drawer,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React from 'react';
import {
  Button as BackstageButton,
  StructuredMetadataTable,
} from '@backstage/core-components';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import CloseIcon from '@material-ui/icons/Close';

interface TableContent {
  [key: string]: any;
}

const useStyles = makeStyles({
  paper: {
    padding: '2em',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: '2em',
  },
  button: {
    textTransform: 'none',
    justifyContent: 'flex-start',
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 20,
  },
  content: {
    height: '80%',
  },
});
export const DetailsDrawerComponent = (rowData: any, baseUrl: string | undefined) => {
  const classes = useStyles();
  const [state, setState] = React.useState(false);
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState(open);
    };
  const tableContent: TableContent = {
    'Argo CD Instance': rowData.metadata?.instance?.name ?? "",
    repoUrl: rowData.spec?.source?.repoURL,
    repoPath: rowData.spec?.source?.path,
    destinationServer: rowData.spec?.destination?.server,
    destinationNamespace: rowData.spec?.destination?.namespace,
    syncStatus: rowData.status?.sync?.status,
    images: rowData.status?.summary?.images,
    ...(baseUrl && {
      link: (
        <BackstageButton
          name="Open Argo CD Dashboard"
          variant="outlined"
          color="primary"
          size="small"
          title='Open Argo CD Dashboard'
          endIcon={<OpenInNewIcon />}
          component={Button}
          target="_blank"
          to={`${baseUrl}/applications/${rowData.metadata.name}`}
        >
          Open Argo CD Dashboard
        </BackstageButton>
      ),
    }),
  };

  const drawerContents = () => (
    <>
      <div className={classes.header}>
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Grid item>
            <Typography variant="h5">
              Argo Name: {rowData.metadata.name}
            </Typography>
          </Grid>
        </Grid>
        <IconButton
          key="dismiss"
          title="Close the drawer"
          onClick={() => setState(false)}
          color="inherit"
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div className={classes.content}>
        <StructuredMetadataTable metadata={tableContent} />
      </div>
    </>
  );
  return (
    <React.Fragment>
      <Button
        title={rowData.metadata.name}
        className={classes.button}
        onClick={toggleDrawer(true)}
      >
        {rowData.metadata.name}
      </Button>
      <Drawer
        anchor='right'
        classes={{ paper: classes.paper }}
        open={state}
        onClose={toggleDrawer(false)}
      >
        {drawerContents()}
      </Drawer>
    </React.Fragment>
  );
};
