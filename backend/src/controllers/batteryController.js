const Battery = require('../models/Battery');

// 모든 배터리 조회
exports.getAllBatteries = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const batteries = await Battery.find(query);
    res.json(batteries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 배터리 상세 조회
exports.getBattery = async (req, res) => {
  try {
    const battery = await Battery.findById(req.params.id);
    if (!battery) {
      return res.status(404).json({ error: '배터리를 찾을 수 없습니다.' });
    }
    res.json(battery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 배터리 추가 (관리자)
exports.addBattery = async (req, res) => {
  try {
    const { name, model, description, price, specifications, stock, category } = req.body;

    const battery = new Battery({
      name,
      model,
      description,
      price,
      specifications,
      stock,
      category
    });

    await battery.save();
    res.status(201).json({
      message: '배터리가 추가되었습니다.',
      battery
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 배터리 수정 (관리자)
exports.updateBattery = async (req, res) => {
  try {
    const battery = await Battery.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!battery) {
      return res.status(404).json({ error: '배터리를 찾을 수 없습니다.' });
    }

    res.json({
      message: '배터리가 수정되었습니다.',
      battery
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 배터리 삭제 (관리자)
exports.deleteBattery = async (req, res) => {
  try {
    const battery = await Battery.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!battery) {
      return res.status(404).json({ error: '배터리를 찾을 수 없습니다.' });
    }

    res.json({ message: '배터리가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
