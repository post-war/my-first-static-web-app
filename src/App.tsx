import React, { useEffect, useState, useRef } from 'react'
import InfiniteScroll from "react-infinite-scroll-component";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { blue, blueGrey, lightBlue, red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import SearchIcon from '@mui/icons-material/Search';

import all from './data.json';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

interface Incident {
  JobName:      string;
  IncidentID:   string;
  WorkDetails?:  string;
  Notes:        string;
  Summary:      string;
  ReportedDate: string;
  ResolvedDate?: string;
  Resolution?:   string;
  SubmitDate:   string;
  SubmitterName: string;
  Submitter:    string;
  Status:       string;
  Assignee:     string;
  AssignedGroup: string;
  MQ:           string;
}
console.log("before loading in incidents[]");
const allData = all  as Incident[];
console.log("after loading in incidents[]");

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const IncidentCard: React.FC<Incident> = 
        ({JobName, ReportedDate, IncidentID,
           Summary, Notes, WorkDetails, MQ}) => {
// function IncidentCard( JobName: string, ReportedDate: string, IncidentID:string, Notes:string, WorkDetails:string ) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{  maxWidth: 700,  border: 1, borderRadius: 2, margin: .5 }} key={IncidentID}>
      <CardHeader
         avatar={
          <Avatar sx={{ bgcolor: red[200] }} aria-label="remedy">
            Job
          </Avatar> 
       /*  avatar={<Avatar
              alt="Remedy"
              src="History.png"
              sx={{ width: 40, height: 40 }}
              variant="rounded"
              />   */
        }
        title={JobName}
        subheader={ReportedDate}
        action={
          <IconButton aria-label="settings">
            {(MQ == "X") ?
          <Chip size="small" label="MQ/FTE" style={{ background: "CornflowerBlue", color: "White" }} />
          : <Typography variant="body2" color="text.secondary"> </Typography>
        }
          </IconButton>
        }

      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Incident No: {IncidentID}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Summary: {Summary}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Notes: {Notes}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography>Work Details:</Typography>
          {/* component=pre to replace all \n in text to actual newline  */}
          <Typography variant="body2" color="text.secondary" component="pre">
             {WorkDetails}
          </Typography>
         </CardContent>
      </Collapse>
    </Card>
  );
}

export default function SearchIncident() {
  //const [allData, setAllData] = React.useState<jsonData>();
  const [filteredData, setFilteredData] = React.useState<Array<Incident>>([]);
  const [displayedData, setDisplayedData] = React.useState<Array<Incident>>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [nextIndex, setNextIndex] = useState<number>(0);
  const [searchInput, setSearchInput] = useState('');
  // useRef is a special state variable but doesn't cause re-render on update 
  const countRef = useRef(0);

  useEffect(() => {
    countRef.current++;
    console.log(`in useEffect ${countRef.current} `);
    if (countRef.current == 1) {
      // Read data.json file
 /*      fetch('./data.json')
        .then((response) =>
         {if (!response.ok) {
          throw new Error(response.statusText)
        }
          response.json()})
        .then((json) => setAllData(json))
        .catch(err => {
          console.log(err);
        }); */
        console.log(`in useEffect after fetch ${allData.length} `);
        setDisplayedData(allData.slice(0,50));
        setNextIndex(50);
        nextIndex > allData.length ? setHasMore(false) : setHasMore(true)
    }
  }, []);

  const fetchMoreData = () => {
    console.log(`in fetchMoreData ${searchInput} ${nextIndex}`);
    if (searchInput !== '') {
      setDisplayedData(displayedData.concat(filteredData.slice(nextIndex,nextIndex + 50)));
      setNextIndex(nextIndex + 50);
      nextIndex > filteredData.length ? setHasMore(false) : setHasMore(true)
    } else {
      setDisplayedData(displayedData.concat(allData.slice(nextIndex,nextIndex + 50)));
      setNextIndex(nextIndex + 50);
      nextIndex > allData.length ? setHasMore(false) : setHasMore(true)
    }
  };

  const searchItems = (searchValue: string) => {
    
    if (searchValue !== '') {
      setFilteredData(allData.filter((item: Incident) => item.JobName.toLowerCase().startsWith(searchValue.toLowerCase())))
      setDisplayedData(filteredData.slice(0,50));
      setNextIndex(50);
      nextIndex > filteredData.length ? setHasMore(false) : setHasMore(true) 
    }
    else{
      setFilteredData([])
      setDisplayedData(allData.slice(0,50));
      setNextIndex(50);
      nextIndex > allData.length ? setHasMore(false) : setHasMore(true)
    }
    setSearchInput(searchValue)
  }

  const handleRefreshSearch = (e: Event) => {
    displayedData.length = 0;
    displayedData.concat(allData.slice(0,50));
    setNextIndex(50);
    nextIndex > allData.length ? setHasMore(false) : setHasMore(true) 
  }

  return (
    <div style={{ padding: 20 }}>
      <Grid container
            direction="column"
            justifyContent="center"
            alignItems="center"
      >
      <Grid item xs={2}>
        <Typography></Typography>
      </Grid>
      <Grid item xs={8}>
         <Card sx={{ maxWidth: 700,  border: 1, borderRadius: 2, margin: .5, position: 'sticky', top: 0}}>
            <CardContent>
            <Typography> 
            
              <TextField label="Search Incidents"
               id="outlined-size-small"
               variant="outlined"
               size="small"
               value={searchInput}
               onChange={(e) => searchItems(e.target.value)}/>
            </Typography>
            </CardContent>
          </Card>

        <InfiniteScroll
          dataLength={displayedData.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          height={800}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>You have reached the end</b>
            </p>
          }
        >
          
            {displayedData.map((dta: Incident, index) => (
              <IncidentCard 
                JobName = {dta.JobName}
                ReportedDate = {dta.ReportedDate}
                IncidentID = {dta.IncidentID}
                Notes = {dta.Notes}
                WorkDetails = {dta.WorkDetails}
                ResolvedDate= {dta.ResolvedDate}
                Summary= {dta.Summary}
                Resolution= {dta.Resolution}
                SubmitDate= {dta.SubmitDate}
                SubmitterName= {dta.SubmitterName}
                Submitter= {dta.Submitter}
                Status= {dta.Status}
                Assignee= {dta.Assignee}
                AssignedGroup= {dta.AssignedGroup}
                MQ= {dta.MQ}
                />
            ))}
         
        </InfiniteScroll>
        </Grid>

        <Grid item xs={2}>
          <Typography></Typography>
        </Grid>

        </Grid>

    </div>

  )
}
