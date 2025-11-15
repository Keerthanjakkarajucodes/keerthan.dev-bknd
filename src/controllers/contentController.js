import Content from '../models/Content.js';

// PUBLIC - Get all content
export const getPublicContent = async (req, res) => {
  try {
    const content = await Content.getSingleton();
    
    res.json({
      success: true,
      data: {
        about: content.about,
        projects: content.projects.sort((a, b) => b.order - a.order),
        achievements: content.achievements.sort((a, b) => b.order - a.order)
      }
    });
  } catch (error) {
    console.error('Get public content error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch content' 
    });
  }
};

// ADMIN - Update about section
export const updateAbout = async (req, res) => {
  try {
    const { about } = req.body;
    
    const content = await Content.getSingleton();
    content.about = about;
    content.updatedAt = new Date();
    await content.save();

    res.json({
      success: true,
      data: { about: content.about }
    });
  } catch (error) {
    console.error('Update about error:', error);
    res.status(500).json({ 
      error: 'Failed to update about section' 
    });
  }
};

// ADMIN - Create project
export const createProject = async (req, res) => {
  try {
    const { title, description, tags, repoUrl, liveUrl, imageUrl, order } = req.body;
    
    const content = await Content.getSingleton();
    
    const newProject = {
      title,
      description,
      tags: tags || [],
      repoUrl: repoUrl || '',
      liveUrl: liveUrl || '',
      imageUrl: imageUrl || '',
      order: order || content.projects.length
    };
    
    content.projects.push(newProject);
    content.updatedAt = new Date();
    await content.save();

    const createdProject = content.projects[content.projects.length - 1];

    res.status(201).json({
      success: true,
      data: createdProject
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ 
      error: 'Failed to create project' 
    });
  }
};

// ADMIN - Update project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const content = await Content.getSingleton();
    const project = content.projects.id(id);
    
    if (!project) {
      return res.status(404).json({ 
        error: 'Project not found' 
      });
    }

    // Update fields
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        project[key] = updates[key];
      }
    });
    
    content.updatedAt = new Date();
    await content.save();

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ 
      error: 'Failed to update project' 
    });
  }
};

// ADMIN - Delete project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    const content = await Content.getSingleton();
    const project = content.projects.id(id);
    
    if (!project) {
      return res.status(404).json({ 
        error: 'Project not found' 
      });
    }

    project.deleteOne();
    content.updatedAt = new Date();
    await content.save();

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ 
      error: 'Failed to delete project' 
    });
  }
};

// ADMIN - Create achievement
export const createAchievement = async (req, res) => {
  try {
    const { title, detail, date, order } = req.body;
    
    const content = await Content.getSingleton();
    
    const newAchievement = {
      title,
      detail,
      date: date || null,
      order: order || content.achievements.length
    };
    
    content.achievements.push(newAchievement);
    content.updatedAt = new Date();
    await content.save();

    const createdAchievement = content.achievements[content.achievements.length - 1];

    res.status(201).json({
      success: true,
      data: createdAchievement
    });
  } catch (error) {
    console.error('Create achievement error:', error);
    res.status(500).json({ 
      error: 'Failed to create achievement' 
    });
  }
};

// ADMIN - Update achievement
export const updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const content = await Content.getSingleton();
    const achievement = content.achievements.id(id);
    
    if (!achievement) {
      return res.status(404).json({ 
        error: 'Achievement not found' 
      });
    }

    // Update fields
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        achievement[key] = updates[key];
      }
    });
    
    content.updatedAt = new Date();
    await content.save();

    res.json({
      success: true,
      data: achievement
    });
  } catch (error) {
    console.error('Update achievement error:', error);
    res.status(500).json({ 
      error: 'Failed to update achievement' 
    });
  }
};

// ADMIN - Delete achievement
export const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    
    const content = await Content.getSingleton();
    const achievement = content.achievements.id(id);
    
    if (!achievement) {
      return res.status(404).json({ 
        error: 'Achievement not found' 
      });
    }

    achievement.deleteOne();
    content.updatedAt = new Date();
    await content.save();

    res.json({
      success: true,
      message: 'Achievement deleted successfully'
    });
  } catch (error) {
    console.error('Delete achievement error:', error);
    res.status(500).json({ 
      error: 'Failed to delete achievement' 
    });
  }
};

