Accounts.ui.config({
    requestPermissions: {},
    extraSignupFields: [{
        fieldName: 'firstName',
        fieldLabel: 'First name',
        inputType: 'text',
        visible: true,
        validate: function(value, errorFunction) {
          if (!value) {
            errorFunction("Please write your first name");
            return false;
          } else {
            return true;
          }
        }
    }, {
        fieldName: 'lastName',
        fieldLabel: 'Last name',
        inputType: 'text',
        visible: true,
    }, {
        fieldName: 'gender',
        showFieldLabel: false,      // If true, fieldLabel will be shown before radio group
        fieldLabel: 'Gender',
        inputType: 'radio',
        radioLayout: 'vertical',    // It can be 'inline' or 'vertical'
        data: [{                    // Array of radio options, all properties are required
    		id: 1,                  // id suffix of the radio element
            label: 'Male',          // label for the radio element
            value: 'm'              // value of the radio element, this will be saved.
          }, {
            id: 2,
            label: 'Female',
            value: 'f',
            checked: 'checked'
        }],
        visible: true
     }]
});

