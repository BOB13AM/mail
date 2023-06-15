document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox')

  // Listen to the submit Button of the composed form 
  document.querySelector('#compose-form').onsubmit = () =>{
    //get all the values of the input fields
    recipients_value = document.querySelector('#compose-recipients').value
    subject_value = document.querySelector('#compose-subject').value
    body_value = document.querySelector('#compose-body').value
    
    fetch('/emails', {
      method:'POST',
      body: JSON.stringify({
        recipients: `${recipients_value}`,
        subject: `${subject_value}`,
        //of course i can plug in the value without the ${} so just learing
        body: body_value
      })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        load_mailbox('sent');
      }); 
      
      return false;
  };

});


function compose_email() {
  // Clear out the ul element
  document.querySelector('#emails-content').innerHTML  = ''
  // Clear out the div page element
  document.querySelector('#emails-page').innerHTML  = ''

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  //return disabled fields to false if needed
  recipients_field = document.querySelector('#compose-recipients')
  subject_field = document.querySelector('#compose-subject')
  recipients_field.disabled = false;
  subject_field.disabled = false;
  

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
 
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

   // Clear out the ul element
   document.querySelector('#emails-content').innerHTML  = ''
   // Clear out the div element
   document.querySelector('#emails-page').innerHTML  = ''

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    emails.forEach(element => {
      const read = `${element.read}`
      if(mailbox === 'inbox'){
        if(read === 'true'){
          document.querySelector('#emails-content').innerHTML += 
          `
                <li class="read_mails_li">
                <div class="row">
                <div class="col-10">
                        <button onclick="email_page(this.value)" class="card read_btn" style="width:100%;" value="${element.id}">
                          <div class="card-body" style="width:100%;">
                              <span style="float:left"><b>${element.sender}</b>  &nbsp; ${element.subject}</span> <small class="text-muted" style="float:right">${element.timestamp}</small>
                          </div>
                        </button>
                   </div>     
                        <div class="col-1" style="margin-top:1%;">
                        <button class="nav-link btn btn-warning"  onclick="email_archive(this.value)" value="${element.id}">Archive</button>
                        </div>
                      </div>      
                </li>
                             
         `;
        }
        else{
          document.querySelector('#emails-content').innerHTML += 
          `
          <li class="mails_li">
          <div class="row">
          <div class="col-10">
                  <button onclick="email_page(this.value)" class="card" style="width:100%;" value="${element.id}">
                    <div class="card-body" style="width:100%;">
                        <span style="float:left"><b>${element.sender}</b>  &nbsp; ${element.subject}</span> <small class="text-muted" style="float:right">${element.timestamp}</small>
                    </div>
                  </button>
             </div>     
                  <div class="col-1" style="margin-top:1%;">
                  <button class="nav-link btn btn-warning"  onclick="email_archive(this.value)" value="${element.id}">Archive</button>
                  </div>
                </div>      
          </li>
          `
        }
      }
      else if(mailbox === 'sent'){
        if(read=='true'){
          document.querySelector('#emails-content').innerHTML += 
          `
          <li class="read_mails_li">
          <button onclick="email_page(this.value)" class="card read_btn" style="width:100%;" value="${element.id}">
              <div class="card-body" style="width:100%;">
                  <span style="float:left"><b>${element.recipients}</b>  &nbsp; ${element.subject}</span> <small class="text-muted" style="float:right">${element.timestamp}</small>
              </div>
            </button>
          </li>`;
        }
        else{
          document.querySelector('#emails-content').innerHTML += 
          `
          <li class="mails_li">
          <button onclick="email_page(this.value)" class="card" style="width:100%;" value="${element.id}">
              <div class="card-body" style="width:100%;">
                  <span style="float:left"><b>${element.recipients}</b>  &nbsp; ${element.subject}</span> <small class="text-muted" style="float:right">${element.timestamp}</small>
              </div>
            </button>
          </li>`;
        }
       
      }
      else if(mailbox === 'archive'){
        if(read === 'true'){
          document.querySelector('#emails-content').innerHTML += 
          `
         
          <li class="read_mails_li">
          <div class="row">
          <div class="col-10">
                  <button onclick="email_page(this.value)" class="card read_btn" style="width:100%;" value="${element.id}">
                    <div class="card-body" style="width:100%;">
                        <span style="float:left"><b>${element.sender}</b>  &nbsp; ${element.subject}</span> <small class="text-muted" style="float:right">${element.timestamp}</small>
                    </div>
                  </button>
             </div>     
                  <div class="col-1" style="margin-top:1%;">
                  <button class="nav-link btn btn-warning"  onclick="email_unarchive(this.value)" value="${element.id}">UnArchive</button>
                  </div>
                </div>      
          </li>
         `;
        }
        else{
          document.querySelector('#emails-content').innerHTML += 
          `
          <li class="mails_li">
          <div class="row">
          <div class="col-10">
                  <button onclick="email_page(this.value)" class="card" style="width:100%;" value="${element.id}">
                    <div class="card-body" style="width:100%;">
                        <span style="float:left"><b>${element.sender}</b>  &nbsp; ${element.subject}</span> <small class="text-muted" style="float:right">${element.timestamp}</small>
                    </div>
                  </button>
             </div>     
                  <div class="col-1" style="margin-top:1%;">
                  <button class="nav-link btn btn-warning"  onclick="email_unarchive(this.value)" value="${element.id}">UnArchive</button>
                  </div>
                </div>      
          </li>
          `
        }
      }

    });
  });

}


function email_page(id){
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Clear out the divs element
  document.querySelector('#emails-page').innerHTML  = ''
  document.querySelector('#emails-view').innerHTML  = ''
  // Clear out the ul element
  document.querySelector('#emails-content').innerHTML  = ''

  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
        document.querySelector('#emails-page').innerHTML += 
            `
            <div class="card">
                <div class="card-body">
                  <h5 class="card-title"><b>From:&nbsp;</b><small>${email.sender}</small></h5>
                  <h5 class="card-title"><b>To:&nbsp;</b><small>${email.recipients}</small></h5>
                  <h5 class="card-title"><b>Subject:&nbsp;</b><small>${email.subject}</small></h5>
                  <h5 class="card-title"><b>TimeStamp:&nbsp;</b><small>${email.timestamp}</small></h5>
        
                  <ul class="nav nav-pills card-header-pills">
                    <li class="nav-item marg">
                      <button class="nav-link btn btn-primary" onclick="email_reply(this.value)" value="${email.id}">Reply</button>
                    </li>
                    <li class="nav-item marg">
                    <button class="nav-link btn btn-danger" onclick="email_unread(this.value)" value="${email.id}">Unread</button>
                    </li>
                  </ul>
                  <hr>
        
                  <p class="card-text">${email.body}</p>
                
                </div>
          </div>
          `;
  })

}

function email_archive(id){
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: true
    })
  })
  .then( ()=>{
      load_mailbox('inbox')
    })
  
}
function email_unarchive(id){
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: false
    })
  })
  .then( ()=>{
    load_mailbox('inbox')
  })
}

function email_unread(id){
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: false
    })
  })
  .then( ()=>{
    load_mailbox('inbox')
  })
}


function email_reply(id){
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out the divs element
  document.querySelector('#emails-page').innerHTML  = ''
  document.querySelector('#emails-view').innerHTML  = ''
  // Clear out the ul element
  document.querySelector('#emails-content').innerHTML  = ''

  //get the compose form fields 
  recipients_field = document.querySelector('#compose-recipients')
  subject_field = document.querySelector('#compose-subject')
  body_field = document.querySelector('#compose-body')

  //clear out the body field 
  document.querySelector('#compose-body').value = '';

  //Re: as a string to check it with the strof the subject
  const re = "Re:"

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    // const var to email subject 
    const  re_subject = `${email.subject}`

    //empyt the recipient field then fill it up again with the original sender of the old email and then disable the field.
    recipients_field.value = ''
    recipients_field.value = `${email.sender}`;
    recipients_field.disabled = true;

    //check if the Re: str is already in subject and fill the subject field accordingly 
    if(re_subject.startsWith(re))
    {
      subject_field.value = ''
      subject_field.value = re_subject;
      subject_field.disabled = true;
    }
    else{
      subject_field.value = ''
      subject_field.value = "Re:" + re_subject;
      subject_field.disabled = true;
    }

    //empty the body field then fill it up with the new data 
    body_field.value =`On ${email.timestamp} ${email.sender} wrote: ${email.body}`;
   
  })

}


