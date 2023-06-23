import React from 'react'
import {HStack,Avatar,Text} from "@chakra-ui/react"


const message = ({text,uri,user}) => {
  return (
    <HStack alignSelf={user==="me"?"flex-end":"flex-start"} bg="blackAlpha.100" borderRadius={"base"} paddingX={user==="me"?"4":"2"} paddingY={"2"}>
        {
            user==="other" &&  <Avatar src={uri}/>
        }
     <Text>{text}</Text>
     { 
      user==="me" && <Avatar src={uri}/>
     }
    
    </HStack>
  )
}

export default message