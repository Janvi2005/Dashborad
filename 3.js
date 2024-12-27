const airtableApiKey = 'patTpweyOyEU0cugD.150ca52a90da5b5771ee3d40525066600555e63c68817705bd0d9c0ea97bc35f';
const baseId = 'app8T4n8zzzHHeIUk';
const subjectsTable = 'tblRMezgpEf8Mzort';
const questionsTable = 'tblH7jojlJsZy2j93';
const headers = {
    Authorization: `Bearer ${airtableApiKey}`,
    'Content-Type': 'application/json',
};

// Save Subject to Airtable
document.getElementById('store-subject-btn').addEventListener('click', async () => {
    const subjectName = document.getElementById('subject-input').value;
    if (!subjectName) {
        alert('Subject name cannot be empty');
        return;
    }

    try {
        await fetch(`https://api.airtable.com/v0/${baseId}/${subjectsTable}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ fields: { Name: subjectName } }),
        });

        document.getElementById('subject-input').value = '';
        loadSubjects();
        alert('Subject saved successfully');
    } catch (error) {
        console.error('Error saving subject:', error);
    }
});

// Load Subjects from Airtable
async function loadSubjects() {
    try {
        const response = await fetch(`https://api.airtable.com/v0/${baseId}/${subjectsTable}`, { headers });
        const data = await response.json();

        const subjectList = document.querySelector('#show-subject .accordion-body');
        const chooseSubject = document.getElementById('choose-subject');
        const chooseShowSubject = document.getElementById('choose-show-subject');

        subjectList.innerHTML = '';
        chooseSubject.innerHTML = '<option value="">Choose Subject</option>';
        chooseShowSubject.innerHTML = '<option value="">Choose Subject</option>';

        data.records.forEach((record) => {
            const { id, fields } = record;

            // Add to subject list
            subjectList.innerHTML += `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span>${fields.Name}</span>
                    <div>
                        <i class="fa fa-edit mx-2" onclick="editSubject('${id}', '${fields.Name}')"></i>
                        <i class="fa fa-trash mx-2" onclick="deleteSubject('${id}')"></i>
                    </div>
                </div>
            `;

            // Add to dropdowns
            chooseSubject.innerHTML += `<option value="${id}">${fields.Name}</option>`;
            chooseShowSubject.innerHTML += `<option value="${id}">${fields.Name}</option>`;
        });
    } catch (error) {
        console.error('Error loading subjects:', error);
    }
}

// Edit Subject
async function editSubject(id, name) {
    const newName = prompt('Edit Subject Name:', name);
    if (newName) {
        try {
            await fetch(`https://api.airtable.com/v0/${baseId}/${subjectsTable}/${id}`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({ fields: { Name: newName } }),
            });
            loadSubjects();
        } catch (error) {
            console.error('Error editing subject:', error);
        }
    }
}

// Delete Subject
async function deleteSubject(id) {
    if (confirm('Are you sure you want to delete this subject?')) {
        try {
            await fetch(`https://api.airtable.com/v0/${baseId}/${subjectsTable}/${id}`, {
                method: 'DELETE',
                headers,
            });
            loadSubjects();
        } catch (error) {
            console.error('Error deleting subject:', error);
        }
    }
}

// Store Question
// Store Question
document.querySelector('#create-question button.btn-primary').addEventListener('click', async (e) => {
    e.preventDefault();
    const subjectId = document.getElementById('choose-subject').value;
    const questionText = document.getElementById('question').value;
    const options = {
        Option1: document.getElementById('question-one').value,
        Option2: document.getElementById('question-two').value,
        Option3: document.getElementById('question-three').value,
        Option4: document.getElementById('question-four').value,
    };
    const correctAnswer = document.getElementById('correct-answer').value;

    if (!subjectId || !questionText || !correctAnswer) {
        alert('Please fill in all fields.');
        return;
    }

    try {
        await fetch(`https://api.airtable.com/v0/${baseId}/${questionsTable}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                fields: {
                    SubjectID: [subjectId],
                    Question: questionText,
                    Option1: options.Option1,
                    Option2: options.Option2,
                    Option3: options.Option3,
                    Option4: options.Option4,
                    CorrectAnswer: correctAnswer,
                },
            }),
        });

        alert('Question saved successfully');
        document.querySelector('#create-question form').reset();
    } catch (error) {
        console.error('Error saving question:', error);
    }
});
// Load Questions by Subject
// Load Questions by Subject
document.getElementById('load-questions-btn').addEventListener('click', async () => {
    const subjectId = document.getElementById('choose-show-subject').value;
    if (!subjectId) {
        alert('Please select a subject.');
        return;
    }

    try {
        // Correct URL construction for filtering questions by subject
        const url = `https://api.airtable.com/v0/${baseId}/${questionsTable}?filterByFormula=${encodeURIComponent(`{SubjectID}='${subjectId}'`)}`;

        const response = await fetch(url, { headers });
        const data = await response.json();

        if (!data.records || data.records.length === 0) {
            alert('No questions found for this subject.');
            return;
        }

        // Render questions
        const questionList = document.getElementById('question-list');
        questionList.innerHTML = '';

        data.records.forEach((record) => {
            const { id, fields } = record;
            questionList.innerHTML += `
                <div class="mb-2">
                    <span><b>${fields.Question}</b></span>
                    <ul>
                        <li>Option 1: ${fields.Option1}</li>
                        <li>Option 2: ${fields.Option2}</li>
                        <li>Option 3: ${fields.Option3}</li>
                        <li>Option 4: ${fields.Option4}</li>
                    </ul>
                    <div>
                        <i class="fa fa-edit mx-2" onclick="editQuestion('${id}', '${fields.Question}', '${fields.Option1}', '${fields.Option2}', '${fields.Option3}', '${fields.Option4}', '${fields.CorrectAnswer}')"></i>
                        <i class="fa fa-trash mx-2" onclick="deleteQuestion('${id}')"></i>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error loading questions:', error);
    }
});


// Call loadSubjects on page load
document.addEventListener('DOMContentLoaded', loadSubjects);

