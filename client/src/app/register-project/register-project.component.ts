import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../http-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-project',
  templateUrl: './register-project.component.html',
  styleUrls: ['./register-project.component.css']
})
export class RegisterProjectComponent implements OnInit {

  companies = [];
  company_id = "";
  project_main_image = "";
  project_name = "";
  project_max_reward = 5500;
  project_notice = "";
  test_notice = "";

  project_story = [{"storyImage" : "", "storyVideo" : "", "storyContent" : ""}];
  project_story_quiz = [
    {"question" : "", "options" : [{"option" : "", "isApproved" : true}, {"option" : "", "isApproved" : false}]}
  ]
  max_participant_num = 10;
  project_end_date = "";
  android_link = "";
  ios_link = "";
  
  project_participation_gender_conditions = [
    {"condition" : "남자", "isApproved" : true},
    {"condition" : "여자", "isApproved" : true}
  ];
  project_participation_age_conditions = [
    {"condition" : "10대", "isApproved" : true},
    {"condition" : "20대", "isApproved" : true},
    {"condition" : "30대", "isApproved" : true},
    {"condition" : "40대", "isApproved" : true},
    {"condition" : "50대+", "isApproved" : true},
  ];
  project_participation_job_conditions = [
    {"condition" : "관리자", "isApproved" : true},
    {"condition" : "전문가", "isApproved" : true},
    {"condition" : "사무직", "isApproved" : true},
    {"condition" : "서비스종사자", "isApproved" : true},
    {"condition" : "판매종사자", "isApproved" : true},
    {"condition" : "기능원 및 관련 기능 종사자", "isApproved" : true},
    {"condition" : "장치, 기계조작 및 조립 종사자", "isApproved" : true},
    {"condition" : "단순노무 종사자", "isApproved" : true},
    {"condition" : "군인", "isApproved" : true},
    {"condition" : "학생", "isApproved" : true},
    {"condition" : "기타", "isApproved" : true},
  ];
  project_participation_region_conditions = [
    {"condition" : "서울특별시", "isApproved" : true},
    {"condition" : "부산광역시", "isApproved" : true},
    {"condition" : "대구광역시", "isApproved" : true},
    {"condition" : "인천광역시", "isApproved" : true},
    {"condition" : "광주광역시", "isApproved" : true},
    {"condition" : "대전광역시", "isApproved" : true},
    {"condition" : "울산광역시", "isApproved" : true},
    {"condition" : "세종특별자치시", "isApproved" : true},
    {"condition" : "경기도", "isApproved" : true},
    {"condition" : "강원도", "isApproved" : true},
    {"condition" : "충청도", "isApproved" : true},
    {"condition" : "전라도", "isApproved" : true},
    {"condition" : "경상도", "isApproved" : true},
    {"condition" : "제주도", "isApproved" : true},
  ];
  project_participation_marriage_conditions = [
    {"condition" : "미혼", "isApproved" : true},
    {"condition" : "기혼", "isApproved" : true},
  ];
  project_participation_phone_os_conditions = [
    {"condition" : "Android", "isApproved" : true},
    {"condition" : "iOS", "isApproved" : true},
  ];
  project_participation_objective_conditions = [
    {"question" : "", "options" : [{"option" : "", "isApproved" : true}, {"option" : "", "isApproved" : false}]}
  ]

  constructor(
    public httpService: HttpServiceService,
    public router: Router
  ) { }

  ngOnInit() {
    this.httpService.getCompanyList()
    .subscribe(
      (data) => {
        if(data.success == true) {
          this.companies = data.data;
        }
        else if(data.success == false) {
          this.httpService.apiRequestErrorHandler(data)
          .then(() => {
            this.ngOnInit();
          })
        }
      },
      (err) => {
        console.log(err);
        alert('오류가 발생했습니다.');
      }
    );
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

  addStory() {
    this.project_story.push({"storyImage" : "", "storyVideo" : "", "storyContent" : ""});
  }

  removeStory() {
    this.project_story.pop();
  }

  addStoryQuiz() {
    this.project_story_quiz.push({"question" : "", "options" : [{"option" : "", "isApproved" : true}, {"option" : "", "isApproved" : false}]});
  }

  removeStoryQuiz() {
    this.project_story_quiz.pop();
  }

  addStoryQuizOption(i) {
    this.project_story_quiz[i].options.push({"option" : "", "isApproved" : false});
  }

  removeStoryQuizOption(i) {
    this.project_story_quiz[i].options.pop();
  }

  addObjectiveCondition() {
    this.project_participation_objective_conditions.push({"question" : "", "options" : [{"option" : "", "isApproved" : true}, {"option" : "", "isApproved" : false}]});
  }

  removeObjectiveCondition() {
    this.project_participation_objective_conditions.pop();
  }

  addOption(i) {
    this.project_participation_objective_conditions[i].options.push({"option" : "", "isApproved" : false});
  }

  removeOption(i) {
    this.project_participation_objective_conditions[i].options.pop();
  }

  uploadFiles(event, target) {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('ex_filename', file);

      this.httpService.uploadFiles(formData)
      .subscribe(
        (data) => {
          if(data.success == true) {
            if(target == 'project_main_image') {
              this.project_main_image = data.data;
            }
            else {
              this.project_story[target].storyImage = data.data;
            }

          }
          else if(data.success == false) {
            this.httpService.apiRequestErrorHandler(data)
            .then(() => {
              this.uploadFiles(event, target);
            })
          }
        },
        (err) => {
          console.log(err);
          alert('오류가 발생했습니다.');
        }
      );

    }
  }

  moveFiles() {
    let images = [];
    if(this.project_main_image != "") {
      images.push(this.project_main_image);
    }
    for(let i=0; i<this.project_story.length; i++) {
      if(this.project_story[i].storyImage != "") {
        images.push(this.project_story[i].storyImage);
      }
    }
    this.httpService.moveFiles(images)
    .subscribe(
      (data) => {
        if(data.success == true) {
          this.project_main_image = this.project_main_image.replace('tmp', 'images');
          for(let i=0; i<this.project_story.length; i++) {
            this.project_story[i].storyImage = this.project_story[i].storyImage.replace('tmp', 'images');
          }
          this.registerProject();
        }
        else if(data.success == false) {
          this.httpService.apiRequestErrorHandler(data)
          .then(() => {
            this.moveFiles();
          })
        }
      },
      (err) => {
        console.log(err);
        alert('오류가 발생했습니다.');
      }
    );

  }

  registerProject() {
    let projectData = {
      "company_id" : this.company_id,
      "project_main_image" : this.project_main_image,
      "project_name" : this.project_name,
      "project_max_reward" : this.project_max_reward,
      "project_notice" : this.project_notice,
      "test_notice" : this.test_notice,
      "project_story" : this.project_story,
      "project_story_quiz" : this.project_story_quiz,
      "max_participant_num" : this.max_participant_num,
      "project_end_date" : this.project_end_date,
      "android_link" : this.android_link,
      "ios_link" : this.ios_link,
      "project_participation_gender_conditions" : this.project_participation_gender_conditions,
      "project_participation_age_conditions" : this.project_participation_age_conditions,
      "project_participation_job_conditions" : this.project_participation_job_conditions,
      "project_participation_region_conditions" : this.project_participation_region_conditions,
      "project_participation_marriage_conditions" : this.project_participation_marriage_conditions,
      "project_participation_phone_os_conditions" : this.project_participation_phone_os_conditions,
      "project_participation_objective_conditions" : this.project_participation_objective_conditions
    }
    this.httpService.registerProject(projectData)
    .subscribe(
      (data) => {
        if(data.success == true) {
          alert('프로젝트가 등록되었습니다.');
          this.router.navigate([ '/admin/home' ]);
        }
        else if(data.success == false) {
          this.httpService.apiRequestErrorHandler(data)
          .then(() => {
            this.registerProject();
          })
        }
      },
      (err) => {
        console.log(err);
        alert('오류가 발생했습니다.');
      }
    );
  }

}
