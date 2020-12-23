import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { IAllowedPlans, IParameter, ISumbitPlanObject } from './queueserver';
import { Box, Button, FormControl, FormControlLabel, FormLabel, Grid, GridList, GridListTile, List, ListItem, ListItemText, Radio, RadioGroup, Select, Switch, TextField, Tooltip } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

type IProps = {
  name: string;
  allowedPlans: IAllowedPlans;
  submitPlan: (selectedPlan: ISumbitPlanObject) => void;
}

interface IState {
  plan: ISumbitPlanObject;
}

export class XAFSPlanForm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      plan: {name: this.props.name,
             kwargs: {}}
    }
  }

  private onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, id, value } = e.target;
    const new_plan = this.state.plan;
    new_plan.kwargs[name][Number(id)] = value;
    this.setState({
        plan: new_plan
    });
  }

  private addParameter(name: string){
    const new_plan = this.state.plan;
    new_plan.kwargs[name].push("");
    this.setState({
        plan: new_plan
    });
  }

  private removeParameter(name: string){
    if (this.state.plan.kwargs[name].length > 1){
      const new_plan = this.state.plan;
      new_plan.kwargs[name].pop();
      this.setState({
          plan: new_plan
      });
    }
  }

  private submit(){
    const new_plan = this.state.plan;
    new_plan.name = this.props.name;
    this.setState({
        plan: new_plan
    });
    this.props.submitPlan(this.state.plan)
  }


  static getDerivedStateFromProps(props : IProps, current_state: IState) {
    const temp_dict: Record<string, (string|number)[]> = {};
    if (current_state.plan.name !== props.name) {
      var i;
      for (i = 0; i < props.allowedPlans.plans_allowed[props.name].parameters.length; i++) {
        if (props.allowedPlans.plans_allowed[props.name].parameters[i].default){
          temp_dict[props.allowedPlans.plans_allowed[props.name].parameters[i].name] = [props.allowedPlans.plans_allowed[props.name].parameters[i].default];
        } else {
          temp_dict[props.allowedPlans.plans_allowed[props.name].parameters[i].name] = [""];
        }
      }
      return {
        plan: {name: props.name,
               kwargs: temp_dict}
      }
    } else {
      return null;
    }
  }

  render(){
    return (
          <Card raised={true}>
            <CardContent>
              <div>
                <GridList spacing={3} cellHeight="auto">
                    <GridListTile key="Subheader" cols={2} style={{ color: "black", border:5, height: 'auto'}}>
                      <Box borderBottom={3}>
                        <Typography align="center" variant="h5" component="h1" >
                          {this.props.name}
                        </Typography>
                        <Typography align="center" gutterBottom>
                          {this.props.allowedPlans.plans_allowed[this.props.name]["description"] ?
                            this.props.allowedPlans.plans_allowed[this.props.name]["description"] : "No plan description found."}
                        </Typography>
                      </Box>
                    </GridListTile>
                    <GridListTile style={{ height: 'auto' }}>
                      <form noValidate autoComplete="off">
                        <div>
                            <TextField required id="element" label="Element" defaultValue="Au" /> &nbsp;
                            <TextField required id="edge" label="Edge" defaultValue="K" />
                        </div>
                        <FormControl fullWidth>
                            <TextField required id="sample" label="Sample" />
                        </FormControl>
                        <FormControl fullWidth>
                            <TextField id="prop" label="Preparation" />
                        </FormControl>
                        <FormControl fullWidth>
                            <TextField id="comment" label="Comment" multiline rows={4} />
                        </FormControl>
                        <div>
                            <TextField required id="nscans" label="Number of scans" type="number" defaultValue="3" /> &nbsp;
                            <TextField required id="start" label="Start" type="number" defaultValue="1" />
                        </div><br />
                        <FormControl>
                            <FormLabel component="legend">Mode</FormLabel>
                            <RadioGroup row id="mode" aria-label="Mode" defaultValue="transmission">
                                <FormControlLabel value="transmission" control={<Radio />} label="Transmission" />
                                <FormControlLabel value="fluorescence" control={<Radio />} label="Fluorescence" />
                                <FormControlLabel value="both" control={<Radio />} label="Both" />
                            </RadioGroup>
                        </FormControl><br />
                        <FormControl>
                            <FormLabel component="legend">Regions:</FormLabel>
                        </FormControl><br />
                        <div>
                            <FormLabel component="legend">Bounds:</FormLabel>
                            <TextField required id="b0" style={{width: 60}} defaultValue="-200" />&nbsp;
                            <TextField required id="b1" style={{width: 60}} defaultValue="-30" />&nbsp;
                            <TextField required id="b2" style={{width: 60}} defaultValue="-10" />&nbsp;
                            <TextField required id="b3" style={{width: 60}} defaultValue="15.5" />&nbsp;
                            <TextField required id="b4" style={{width: 60}} defaultValue="15k" />
                        </div>
                        <div>
                            <FormLabel component="legend">Steps:</FormLabel>
                            <TextField required id="b0" style={{width: 60}} defaultValue="10" />&nbsp;
                            <TextField required id="b1" style={{width: 60}} defaultValue="2.0" />&nbsp;
                            <TextField required id="b2" style={{width: 60}} defaultValue="0.3" />&nbsp;
                            <TextField required id="b4" style={{width: 60}} defaultValue="0.05k" />
                        </div>
                        <div>
                            <FormLabel component="legend">Times:</FormLabel>
                            <TextField required id="b0" style={{width: 60}} defaultValue="0.5" />&nbsp;
                            <TextField required id="b1" style={{width: 60}} defaultValue="0.5" />&nbsp;
                            <TextField required id="b2" style={{width: 60}} defaultValue="0.5" />&nbsp;
                            <TextField required id="b4" style={{width: 60}} defaultValue="0.25k" />
                        </div><br />
                        <Button variant="contained">Submit</Button>
                      </form>
                    </GridListTile>
                  </GridList>     
              </div>
            </CardContent>
            <CardActions disableSpacing style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => this.submit()}  variant="contained" color="primary">
                submit plan
              </Button>
            </CardActions>
          </Card>
    );
  }
}