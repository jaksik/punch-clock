import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import {plus} from './GetDate';

function PunchClock() {

 

  console.log("Get Date: ", plus(3, 4))

  return (
    <div>
      <Button>Clock In</Button>
    </div>
  );
}

export default PunchClock