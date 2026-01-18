$(".errorMessage").hide();
$(document).ready(function() {
    let currentProjectImages = [];
    let currentImageIndex = 0;
    let autoChangeInterval = null;
    // Check for saved theme
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        $('html').attr('data-theme', currentTheme);
        $('.switch input').prop('checked', currentTheme === 'dark');
    }

    // Theme toggle handler
    $('.switch input').change(function() {
        const isChecked = $(this).prop('checked');
        $('html').attr('data-theme', isChecked ? 'dark' : 'light');
        localStorage.setItem('theme', isChecked ? 'dark' : 'light');
        
        // Toggle icon visibility
        $('.darkThemeImg, .lightThemeImg').toggleClass('active');
    });

$('#about-link, #contact-link').click(function(){
    $('#home-section, #about-section, #contact-section').hide();
    $('#contact-link, #about-link').removeClass('active');

    if(this.id === 'about-link'){
        $('#about-link').addClass('active');
        $('#about-section').fadeIn(500);

    } else {
        $('#contact-link').addClass('active');
        $('#contact-section').fadeIn(500);
    }
  });
  
  $('#home-link, #project-link, #project-link-2, #skills-link').click(function(e){
    e.preventDefault();
    $('#about-section, #contact-section').hide();
    $('#home-section').fadeIn(500);
    var target = $(this).attr('href');
    if(target && $(target).length){
        $('html, body').animate({scrollTop: $(target).offset().top}, 500);
        $('#contact-link, #about-link').removeClass('active');
    }
  });

    // JavaScript
    function setActiveNav() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('active', 
                            link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => observer.observe(section));
    }

    // Initialize
    window.addEventListener('DOMContentLoaded', setActiveNav);
    window.addEventListener('scroll', setActiveNav);
    

    $('.smoothScroll').on('click', function(event) {
        event.preventDefault();
        var target = $(this.hash);
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 500);
      });

      $('.hamMenu').on('click', function(){
        $('nav ul').toggleClass('active')
      });

    let projects = []; // Will be populated from JSON
    function loadProjects() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: 'projects.json',
                dataType: 'json',
                success: function(data) {
                    projects = data.projects || [];
                    console.log('Projects loaded successfully:', projects.length);
                    resolve(projects);
                },
                error: function(xhr, status, error) {
                    console.error('Error loading projects.json:', error);
                    // Fallback to empty array if file doesn't exist
                    projects = [];
                    resolve(projects);
                }
            });
        });
    }


// Update the initializePage function to load skills from JSON
async function initializePage() {
    try {
        // Load projects from JSON
        await loadProjects();
        
        // Load skills from JSON
        await loadSkills();
        
        // Render projects
        renderProjects();
        
        // Initialize skills
        initializeSkills();
        
        // Initialize SVG replacement
        $('.skillIcon').each(function() {
            replaceSVGs(this);
        });
        
        // Attach event listeners to skill togglers
        $('.skillToggler').on('mousedown touchstart', startDrag);
        
        // ... rest of your initialization code
    } catch (error) {
        console.error('Failed to initialize page:', error);
    }
}

    const icons = {
        github: `<svg class="icon" viewBox="0 0 250 250">
            <path fill="currentColor" d="M124.92 2.85c67.88,0 122.92,55.04 122.92,122.93 0,56.58 -38.23,104.22 -90.27,118.52 0,-0.11 -0.01,-0.23 -0.01,-0.36 0,-4.29 0.17,-18.38 0.17,-35.86 0,-12.2 -4.17,-20.17 -8.84,-24.21 29,-3.23 59.45,-14.29 59.45,-64.51 0,-14.27 -5.04,-25.94 -13.39,-35.08 1.34,-3.31 5.81,-16.6 -1.29,-34.6 0,0 -10.92,-3.51 -35.77,13.4 -10.4,-2.9 -21.54,-4.35 -32.6,-4.4 -11.08,0.05 -22.22,1.5 -32.61,4.4 -24.87,-16.91 -35.81,-13.4 -35.81,-13.4 -7.08,18 -2.61,31.29 -1.27,34.6 -8.33,9.14 -13.4,20.81 -13.4,35.08 0,50.1 30.4,61.31 59.31,64.61 -3.72,3.27 -7.09,9.03 -8.27,17.48 -7.42,3.35 -26.28,9.11 -37.9,-10.86 0,0 -6.88,-12.55 -19.94,-13.48 0,0 -12.72,-0.16 -0.89,7.95 0,0 8.53,4.02 14.45,19.12 0,0 7.64,25.43 43.87,17.53 0.06,10.91 0.18,19.13 0.18,22.23 0,0.19 -0.01,0.38 -0.04,0.56 -52.4,-14.07 -90.98,-61.89 -90.98,-118.72 0,-67.89 55.04,-122.93 122.93,-122.93z"/>
        </svg>`,
        
        external: `<svg class="icon" viewBox="0 0 250 250">
            <path fill="currentColor" d="M109.21 8.06l0 21.6c0,2.9 -2.37,5.27 -5.27,5.27l-59.44 0c-5.37,0 -9.74,4.37 -9.74,9.74l0 160.83c0,5.37 4.37,9.74 9.74,9.74l160.83 0c5.37,0 9.74,-4.37 9.74,-9.74l0 -60.87c0,-2.9 2.37,-5.26 5.27,-5.26l21.6 0c2.9,0 5.27,2.36 5.27,5.26l0 80.37c0,12.33 -10.05,22.38 -22.38,22.38l-199.83 0c-12.33,0 -22.38,-10.05 -22.38,-22.38l0 -199.83c0,-12.33 10.05,-22.38 22.38,-22.38l78.94 0c2.9,0 5.27,2.37 5.27,5.27zm105.86 50.36l-72.32 70.46c-2.08,2.02 -5.43,1.98 -7.45,-0.1l-15 -15.43c-2.02,-2.08 -1.98,-5.42 0.1,-7.44l72.87 -70.98 -46.66 0c-2.9,0 -5.27,-2.37 -5.27,-5.27l0 -21.6c0,-2.9 2.37,-5.27 5.27,-5.27l78.22 0c12.33,0 22.38,10.05 22.38,22.38l0 76.8c0,2.9 -2.37,5.26 -5.27,5.26l-21.6 0c-2.9,0 -5.27,-2.36 -5.27,-5.26l0 -43.55z"/>
        </svg>`
    };

    function createProjectElement(project) {
        const $project = $('<div>').addClass('projects');
        
        const $tags = $('<ul>').addClass('projectTags');
        project.tags.forEach(tag => {
            $tags.append($('<li>').addClass('Tag').text(tag));
        });

        $project.html(`
            <div class="projectImgContainer">
                <img src="${project.image}" alt="${project.name}" class="projectImg">
                <div class="viewProjImgBtn">
                    <button class="buttonStyle2">View project images</button>
                </div>
            </div>
            <div class="projectInfo">
                <h2 class="projectName">${project.name}</h2>
                <div class="projectDescription">${project.description}</div>
                ${$tags.prop('outerHTML')}
                <div class="aboutProjectsContainer">
                <a href="${project.liveDemo || 'javascript:void(0)'}" class="liveDemoLink" target="_blank">
                        ${icons.external}
                        Live Demo
                    </a>
                    <a href="${project.sourceCode || 'javascript:void(0)'}" class="sourceCodeLink" target="_blank">
                        ${icons.github}
                        Source Code
                    </a>
                </div>
                <div class="viewProjImgBtn">
                    <button class="buttonStyle1">View project images</button>
                </div>
                <div class="errorMessage"></div>
            </div>
        `);
        
        // Modified link handler
        const handleEmptyLink = (selector, message) => {
            $project.find(selector).on('click', function(e) {
                const href = $(this).attr('href').trim();
                if (!href || href === '#') {
                    e.preventDefault();
                    const $error = $(this).closest('.projectInfo').find('.errorMessage');
                    $error.stop(true, true)
                        .text(message)
                        .fadeIn(300)
                        .addClass('shake')
                        .delay(2000)
                        .fadeOut(300);
                        setTimeout(() => {
                            $('.errorMessage').removeClass('shake');
                        }, 800);
                    console.log("Empty link handled:", message);
                }
            });
        };

        handleEmptyLink('.liveDemoLink', 'This project does not have a live demo');
        handleEmptyLink('.sourceCodeLink', 'Source code is unavailable for this project');
        
        $project.data('projectData', project); // Store the entire project object
        return $project;
    }

    function renderProjects() {
        const $container = $('.projectsContainer');
        $container.empty();
        projects.forEach(project => {
            $container.append(createProjectElement(project));
        });
    }

    renderProjects();

    // =============================== SKILL SECTION FUNCTIONALITY HERE==========================================
    // Skill Data
    let skills = []; // Will be populated from JSON

    function loadSkills() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'skills.json',
            dataType: 'json',
            success: function(data) {
                skills = data.skills || [];
                console.log('Skills loaded successfully:', skills.length);
                resolve(skills);
            },
            error: function(xhr, status, error) {
                console.error('Error loading skills.json:', error);
                // Fallback to empty array if file doesn't exist
                skills = [];
                resolve(skills);
            }
        });
    });
}


function createSkillElement(skill) {
    const circumference = 2 * Math.PI * 70;
    const progressOffset = circumference * (1 - skill.percentage / 110);
    
    return $(`
    <div class="skillMainDisplay">
        <div class="skill">
            <div class="skillDetails">
                <img src="${skill.icon}" alt="${skill.name}" class="svg skillIcon">
                <h3 class="skillName">${skill.name}</h3>
            </div>
            <div class="SkillLevel">
                <div class="outerBar">
                    <div class="innerBar">
                        <div class="progressText">${skill.percentage}%</div>
                    </div>
                    <svg viewBox="0 0 160 160" class="progressCircle">
                        <circle cx="80" cy="80" r="70" 
                                stroke-dasharray="${circumference}"
                                stroke-dashoffset="${progressOffset}"
                                stroke-linecap="round"/>
                    </svg>
                </div>
            </div>
        </div>
        <button class="skillToggler"></button>
        <div class="skillDescription">${skill.description}</div>
    </div>
    `);
}



// Initialize skills
function initializeSkills() {
    const containers = {
        frontend: $('.frontEndSkills'),
        backend: $('.backEndSkills'),
        others: $('.otherSkills')
    };

    // Clear existing skills first to prevent duplicates
    Object.values(containers).forEach(container => container.empty());
    
    // Add skills from the skills array
    skills.forEach(skill => {
        const container = containers[skill.category];
        if (container) {
            container.append(createSkillElement(skill));
        }
    });
}

    
    // Initialize SVG replacement for all skills
    $('.skillIcon').each(function() {
        replaceSVGs(this);
    });


    let isDragging = false;
    let startY;
    let initialHeight;
    let $currentSkill;

    // Function to handle the start of dragging
    function startDrag(e) {
        $('body').addClass('noScrollBar');
        // Get the specific skill container
        $currentSkill = $(this).closest('.skillMainDisplay').find('.skill');
        $currentSkill.removeClass('minimize');
        isDragging = true;
        startY = e.pageY || e.touches[0].pageY;
        initialHeight = $currentSkill.height();
        e.preventDefault();
    }

    // Function to handle the dragging motion
    function duringDrag(e) {
        if (isDragging && $currentSkill) {
        $('.skill').not($currentSkill).css('height', '100%');
            const currentY = e.pageY || e.touches[0].pageY;
            const deltaY = currentY - startY;
            let newHeight = initialHeight + deltaY;
            newHeight = Math.max(0, newHeight);
            newHeight = Math.min(100, newHeight);
            $currentSkill.css('height', newHeight + '%');
        }
    }

    // Function to handle the end of dragging
    function endDrag() {
        $('body').removeClass('noScrollBar');
        if (isDragging && $currentSkill) {
            const currentHeight = $currentSkill.height();
            if (currentHeight <= 50) {
                $currentSkill.addClass('minimize').css('height', '0%');
            } else {
                $currentSkill.addClass('minimize').css('height', '100%');
            }
            isDragging = false;
            $currentSkill = null; // Clear reference
        }
    }


    function displayImage(index) {
        if (currentProjectImages.length === 0) return;
        
        currentImageIndex = index;
        const img = currentProjectImages[index];
        
        // Update main display
        $('#display').attr('src', img.src).attr('alt', img.description);
        
        // Update active thumbnail
        $('.thumbnailCard').css('border', 'none');
        $(`.thumbnailCard[data-index="${index}"]`).css({
            'border': '5px solid var(--primary-light-theme2)'
        });
    }

    function initializeGallery(project) {
        currentProjectImages = project.images || [];
        currentImageIndex = 0;
        
        // Set modal title
        $('.viewProjImgModalContent h2').text(project.name);
        
        // Clear and populate thumbnails
        $('.thumbnailContainer').empty();
        currentProjectImages.forEach((img, index) => {
            const $thumb = $(`
                <div class="thumbnailCard" data-index="${index}">
                    <span>${img.description}</span>
                    <img src="${img.thumb}" alt="${img.description}">
                </div>
            `);
            $('.thumbnailContainer').append($thumb);
        });
        
        // Display first image
        displayImage(0);
        
        // Start auto-change
        startAutoChange();
    }

    function nextImage() {
        const nextIndex = (currentImageIndex + 1) % currentProjectImages.length;
        displayImage(nextIndex);
        resetAutoChange();
    }

    function previousImage() {
        const prevIndex = (currentImageIndex - 1 + currentProjectImages.length) % currentProjectImages.length;
        displayImage(prevIndex);
        resetAutoChange();
    }

    function startAutoChange() {
        stopAutoChange();
        autoChangeInterval = setInterval(() => {
            nextImage();
        }, 5000);
    }

    function stopAutoChange() {
        if (autoChangeInterval) {
            clearInterval(autoChangeInterval);
            autoChangeInterval = null;
        }
    }

    function resetAutoChange() {
        stopAutoChange();
        startAutoChange();
    }

$('#expand-thumb-btn').on('click', function(){
    const $thumbnailContainer = $('.thumbnailContainer');
    const $expandIcon = $('#expand-icon');
    const $compressIcon = $('#compress-icon');
    
    $thumbnailContainer.toggleClass('expand');
    
    // Toggle icons based on state
    if ($thumbnailContainer.hasClass('expand')) {
        $expandIcon.hide();
        $compressIcon.show();
    } else {
        $expandIcon.show();
        $compressIcon.hide();
    }
});

$(document).on('click', '.viewProjImgBtn button', function() {
    const project = $(this).closest('.projects').data('projectData');
    
    if (!project.images || project.images.length === 0) {
        const $projectContainer = $(this).closest('.projects');
        const $error = $projectContainer.find('.errorMessage');
        
        $error.stop(true, true)
            .text('No images available for this project')
            .fadeIn(300)
            .addClass('shake')
            .delay(2000)
            .fadeOut(300);
        
        setTimeout(() => {
            $error.removeClass('shake');
        }, 2300);
        return;
    }
    
    initializeGallery(project);
    $('.viewProjImgModal').fadeIn();
    
    // Reset expand/compress icons when modal opens
    $('#expand-icon').show();
    $('#compress-icon').hide();
    $('.thumbnailContainer').removeClass('expand');
});

    $('#close-modal-btn').on('click', ()=>{
        stopAutoChange();
        $('.viewProjImgModal').fadeOut();
    });

    $('#next-image-btn').on('click', nextImage);
    $('#previous-image-btn').on('click', previousImage);

    $(document).on('click', '.thumbnailCard', function() {
        const index = $(this).data('index');
        displayImage(index);
        resetAutoChange();
    });

    // Attach event listeners to each skillToggler
    $('.skillToggler').on('mousedown touchstart', startDrag);
    $(document).on('mousemove touchmove', duringDrag);
    $(document).on('mouseup touchend', endDrag);

     initializePage().then(() => {
        console.log('Page initialized successfully');
    }).catch(error => {
        console.error('Page initialization failed:', error);
    });

    
});